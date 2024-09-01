import Endpoint from "../models/endpoint.model.js";
import Schema from "../models/schema.model.js";

export const getEndpoints = async (req, res) => {
  const { id, path } = req.query;

  let wherePayload = {};

  if (id) {
    wherePayload = { ...wherePayload, _id: id };
  }
  if (path) {
    wherePayload = { ...wherePayload, path };
  }

  try {
    const endpoints = await Endpoint.find(wherePayload);
    return res.json(endpoints);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error getting endpoints", error });
  }
};

export const ingestEndpoints = async (req, res) => {
  try {
    const openapi = req.body;

    // Parse and save schemas first, updating if they already exist
    const schemaIds = {};
    if (openapi.components && openapi.components.schemas) {
      for (const [name, schema] of Object.entries(openapi.components.schemas)) {
        const properties = schema.properties
          ? Object.entries(schema.properties).map(([key, value]) => ({
              name: key,
              type: value.type,
              title: value.title || key,
              anyOf: value.anyOf,
              items: value.items,
            }))
          : [];

        const newSchemaData = {
          name: name,
          title: schema.title || name,
          type: schema.type || "object",
          properties,
          required: schema.required || [],
        };

        // create new schema or update existing one
        const savedSchema = await Schema.findOneAndUpdate(
          { name: name },
          newSchemaData,
          { new: true, upsert: true }
        );

        schemaIds[name] = savedSchema._id;
      }
    }

    // Parse and save endpoints
    if (openapi.paths) {
      for (const [path, methods] of Object.entries(openapi.paths)) {
        for (const [method, details] of Object.entries(methods)) {
          const endpointData = {
            path,
            method,
            summary: details.summary || "",
            operationId: details.operationId || "",
            parameters: details.parameters
              ? details.parameters.map((param) => ({
                  name: param.name,
                  in: param.in,
                  required: param.required || false,
                  schemaRef: {
                    type: param.schema.type || "string",
                    title: param.schema.title || param.name,
                  },
                }))
              : [],
            requestBody:
              details.requestBody &&
              details.requestBody.content &&
              details.requestBody.content["application/json"] &&
              details.requestBody.content["application/json"].schema &&
              details.requestBody.content["application/json"].schema.$ref
                ? {
                    content: {
                      "application/json": {
                        schemaRef:
                          schemaIds[
                            details.requestBody.content[
                              "application/json"
                            ].schema.$ref
                              .split("/")
                              .pop()
                          ],
                      },
                    },
                    required: details.requestBody.required || false,
                  }
                : undefined,
            responses: details.responses
              ? Object.entries(details.responses).reduce(
                  (acc, [status, response]) => {
                    acc[status] = {
                      description: response.description || "",
                      content:
                        response.content &&
                        response.content["application/json"] &&
                        response.content["application/json"].schema &&
                        response.content["application/json"].schema.$ref
                          ? {
                              "application/json": {
                                schemaRef:
                                  schemaIds[
                                    response.content[
                                      "application/json"
                                    ].schema.$ref
                                      .split("/")
                                      .pop()
                                  ],
                              },
                            }
                          : undefined,
                    };
                    return acc;
                  },
                  {}
                )
              : {},
          };

          // create new endpoint or update existing one
          await Endpoint.findOneAndUpdate({ path, method }, endpointData, {
            new: true,
            upsert: true,
          });
        }
      }
    }

    res
      .status(200)
      .send({ message: "Endpoints and schemas ingested successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Error ingesting endpoints and schemas", error });
  }
};

export const updateEndpoint = async (req, res) => {
  try {
    const updatedEndpoint = await Endpoint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedEndpoint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller to delete an endpoint by ID
export const deleteEndpoint = async (req, res) => {
  try {
    const deletedEndpoint = await Endpoint.findByIdAndDelete(req.params.id);

    if (!deletedEndpoint) {
      return res.status(404).json({ message: "Endpoint not found" });
    }

    // remove related threats
    await Threat.deleteMany({ endpoint: req.params.id });

    res.status(200).json({ message: "Endpoint deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to delete multiple endpoints based on array of IDs or path
export const deleteManyEndpoints = async (req, res) => {
  try {
    const { ids, path } = req.body;

    let wherePayload = {};

    if (ids && Array.isArray(ids)) {
      wherePayload = { _id: { $in: ids } };
    } else {
      if (path) {
        wherePayload = { path };
      }
      const idsToDelete = await Endpoint.find(wherePayload).select("_id");
    }

    const result = await Endpoint.deleteMany(wherePayload);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Endpoints not found" });
    }

    // Remove related threats
    if (ids && Array.isArray(ids)) {
      await Threat.deleteMany({ endpoint: { $in: ids } });
    } else {
      await Threat.deleteMany({ endpoint: { $in: idsToDelete } });
    }

    res.status(200).json({
      message: `${result.deletedCount} endpoints deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
