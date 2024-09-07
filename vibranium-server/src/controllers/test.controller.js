import Endpoint from "../models/endpoint.model";
import Organization from "../models/organization.model";
import Schema from "../models/schema.model";
import {
  testBOLA,
  testBrokenAuth,
  testPasswordLeak,
} from "../tests/endpointtests";
import { FASTAPI_URL } from "../config";

export const testEndpoint = async (req, res) => {
  const { id } = req.params;
  const { organization, secure } = req.body;

  try {
    const endpoint = await Endpoint.findById(id);
    if (!endpoint) {
      return res.status(404).json({ message: "Endpoint not found" });
    }

    const organizationFound = await Organization.findById(organization);
    if (!organizationFound) {
      return res.status(404).json({ message: "Organization not found" });
    }

    let endpoint_path = endpoint.path;
    let param = "";
    let use_param = false;

    // check if endpoint is of the form /endpoint/{paramname}
    if (endpoint.path.includes("{")) {
      endpoint_path = endpoint.path.split("{")[0];
      if (endpoint.parameters.length === 0) {
        return res
          .status(400)
          .json({ message: "Parameter missing during parsing" });
      }

      use_param = true;
      param_type = endpoint.parameters[0]?.schemaRef?.type;
      if (param_type === "string") {
        param = "test";
      } else if (param_type === "number") {
        param = 1;
      }
    }

    payload = {};

    if (endpoint?.requestBody.required) {
      const schema_id =
        endpoint.requestBody.content["application/json"].schemaRef;
      const schema_found = await Schema.findById(schema_id);

      if (!schema_found) {
        return res.status(404).json({ message: "Schema not found" });
      }

      for (const property of schema_found.properties) {
        if (property.type === "string") {
          payload[property.name] = "test";
        } else if (property.type === "number") {
          payload[property.name] = 1;
        } else if (property.type === "boolean") {
          payload[property.name] = true;
        } else if (property.type === "object") {
          payload[property.name] = {};
        } else if (property.type === "array") {
          payload[property.name] = [];
        }
      }
    }

    if (secure) {
      await testBrokenAuth(
        FASTAPI_URL,
        endpoint_path + param,
        endpoint.method,
        payload
      );
    }

    const token = organizationFound.testingCredentials.token;

    // Test for excessive data exposure
    await testPasswordLeak(
      FASTAPI_URL + endpoint_path + param,
      token,
      endpoint.method,
      payload
    );

    const user_id = organizationFound.testingCredentials.userId;
    // Test for BOLA
    if (use_param) {
      await testBOLA(FASTAPI_URL, endpoint_path, token, user_id);
    }

    return res.status(200).json({ message: "Tests completed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
