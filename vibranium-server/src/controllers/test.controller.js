import Endpoint from "../models/endpoint.model.js";
import Organization from "../models/organization.model.js";
import Schema from "../models/schema.model.js";
import Test from "../models/test.model.js";
import {
  testBOLA,
  testBrokenAuth,
  testPasswordLeak,
} from "../tests/endpointtests.js";
import { FASTAPI_URL } from "../config.js";

export const testEndpoint = async (req, res) => {
  const { id } = req.params;
  const { organization, secure } = req.body;

  const testCounter = {
    tests_performed: 0,
    tests_passed: 0,
  };

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
      const param_type = endpoint.parameters[0]?.schemaRef?.type;
      if (param_type === "string") {
        param = "test";
      } else if (param_type === "number" || param_type === "integer") {
        param = 1;
      }
    }

    const payload = {};

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
        } else if (property.type === "number" || property.type === "integer") {
          payload[property.name] = 1;
        } else if (property.type === "boolean") {
          payload[property.name] = true;
        } else if (property.type === "object") {
          payload[property.name] = {};
        } else if (property.type === "array") {
          payload[property.name] = [];
        } else {
          payload[property.name] = "test";
        }
      }
    }
    if (secure) {
      const BrokenAuthRes = await testBrokenAuth(
        FASTAPI_URL,
        endpoint_path + param,
        id,
        endpoint.method,
        payload
      );

      testCounter.tests_performed += 1;
      if (BrokenAuthRes.success) {
        testCounter.tests_passed += 1;
      }
    }

    const token = organizationFound.testingCredentials.token;

    // Test for excessive data exposure
    const passwordRes = await testPasswordLeak(
      FASTAPI_URL + endpoint_path + param,
      token,
      id,
      endpoint.method,
      payload
    );

    if (passwordRes.success) {
      testCounter.tests_passed += 1;
    }
    testCounter.tests_performed += 1;

    const user_id = organizationFound.testingCredentials.userId;
    // Test for BOLA
    if (use_param) {
      const BolaRes = await testBOLA(
        FASTAPI_URL,
        endpoint_path,
        token,
        user_id,
        id
      );
      if (BolaRes.success) {
        testCounter.tests_passed += 1;
      }
      testCounter.tests_performed += 1;
    }

    await Test.create({
      endpoint: id,
      testsPerformed: testCounter.tests_performed,
      testsPassed: testCounter.tests_passed,
    });

    return res.status(200).json({ message: "Tests completed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
