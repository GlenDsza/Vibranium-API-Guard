import Endpoint from "../models/endpoint.model.js";
import Schema from "../models/schema.model.js";

export const getEndpoints = async (req, res) => {
  const { id, path } = req.query;

  if (id) {
    // Get endpoint by ID
    const endpoint = await Endpoint.findById(id);
    if (!endpoint) {
      return res.status(404).json({ message: "Endpoint not found" });
    }
    return res.json(endpoint);
  } else if (path) {
    // Get endpoint by path
    const endpoint = await Endpoint.findOne({ path });
    if (!endpoint) {
      return res.status(404).json({ message: "Endpoint not found" });
    }
    return res.json(endpoint);
  } else {
    // Get all endpoints
    const endpoints = await Endpoint.find();
    return res.json(endpoints);
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
