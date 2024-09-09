import Endpoint from "../models/endpoint.model.js";
import Organization from "../models/organization.model.js";
import Schema from "../models/schema.model.js";
import Test from "../models/test.model.js";
import Threat from "../models/threat.model.js";
import {
  testBOLA,
  testBrokenAuth,
  testPasswordLeak,
  testParamLimits,
  testSecurityHeaders,
  testIDOR,
  testExcessiveIDORExposure,
} from "../tests/endpointtests.js";
import { FASTAPI_URL } from "../config.js";

export const testEndpoint = async (req, res) => {
  const { id } = req.params;
  const { organization, secure } = req.body;

  const testsPerformed = [];

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
    let param_type = "";
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

      testsPerformed.push({
        testName: "Broken Authentication",
        testSuccess: BrokenAuthRes.success,
      });
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

    testsPerformed.push({
      testName: "Excessive Data Exposure",
      testSuccess: passwordRes.success,
    });

    const idorExposureTestRes = await testExcessiveIDORExposure(
      FASTAPI_URL + endpoint_path + param,
      token,
      id,
      endpoint.method,
      payload
    );

    testsPerformed.push({
      testName: "Internal Data Exposure",
      testSuccess: idorExposureTestRes.success,
    });

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
      testsPerformed.push({
        testName: "Broken Object Level Authorization",
        testSuccess: BolaRes.success,
      });

      const idorTestRes = await testIDOR(
        FASTAPI_URL + endpoint_path,
        token,
        id,
        param_type,
        endpoint.method,
        payload
      );
      testsPerformed.push({
        testName: "Insecure Direct Object Reference",
        testSuccess: idorTestRes.success,
      });
    }

    // Test for security headers
    const securityHeadersRes = await testSecurityHeaders(
      FASTAPI_URL,
      endpoint_path + param,
      token,
      id,
      endpoint.method,
      payload
    );
    testsPerformed.push({
      testName: "Security Misconfiguration",
      testSuccess: securityHeadersRes.success,
    });

    if (endpoint.method.toUpperCase() == "POST" && payload) {
      // Test for parameter limits
      const paramLimitsRes = await testParamLimits(
        FASTAPI_URL,
        endpoint_path + param,
        token,
        id,
        payload
      );
      testsPerformed.push({
        testName: "Unrestricted Resource Consumption",
        testSuccess: paramLimitsRes.success,
      });
    }

    await Test.create({
      endpoint: id,
      testsPerformed: testsPerformed,
    });

    return res.status(200).json({ message: "Tests completed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getTests = async (req, res) => {
  try {
    const tests = await Test.find().populate("endpoint", "path method");
    return res.status(200).json({ tests });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTest = async (req, res) => {
  const { id } = req.params;
  try {
    const test = await Test.findById(id);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    } else {
      await Test.findByIdAndDelete(id);
      return res.status(200).json({ message: "Test deleted successfully" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getDashboradData = async (req, res) => {
  try {
    const endpoint_count = await Endpoint.countDocuments();
    const threats_count = await Threat.countDocuments();
    const all_tests = await Test.find();
    const passed_tests_count = all_tests.filter((test) =>
      test.testsPerformed.every((test) => test.testSuccess)
    ).length;
    const failed_tests_count = all_tests.filter((test) =>
      test.testsPerformed.some((test) => !test.testSuccess)
    ).length;

    const all_endpoints = await Endpoint.find();
    const threats_for_enpoints = await Promise.all(
      all_endpoints.map(async (endpoint) => {
        const threats = await Threat.find({ endpoint: endpoint._id });

        const threat_level = threats.reduce((acc, threat) => {
          if (threat.severity === "High") {
            return "High";
          } else if (threat.severity === "Medium") {
            return acc === "High" ? "High" : "Medium";
          } else {
            return acc === "High" || acc === "Medium" ? acc : "Low";
          }
        }, "None Detected");

        return threat_level;
      })
    );

    const high_severity_threats = threats_for_enpoints.filter(
      (threat) => threat === "High"
    ).length;
    const medium_severity_threats = threats_for_enpoints.filter(
      (threat) => threat === "Medium"
    ).length;
    const low_severity_threats = threats_for_enpoints.filter(
      (threat) => threat === "Low"
    ).length;
    const none_detected_threats = threats_for_enpoints.filter(
      (threat) => threat === "None Detected"
    ).length;

    const threats_by_type = await Threat.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
    ]);

    return res.status(200).json({
      endpoint_count,
      threats_count,
      passed_tests_count,
      failed_tests_count,
      high_severity_threats,
      medium_severity_threats,
      low_severity_threats,
      none_detected_threats,
      threast_by_type: threats_by_type,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
