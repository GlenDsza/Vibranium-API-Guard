import axios from "axios";
import Threats from "../models/threat.model.js";
import {
  excessiveArray,
  excessiveObject,
  excessiveString,
  maketoken,
  checkIsHashed,
} from "./helpers.js";

// Function to test for BOLA by trying to access a restricted resource
export async function testBOLA(baseUrl, endpoint, token, userId, endpointId) {
  if (parseInt(userId) !== NaN) {
    userId = parseInt(userId);
  }
  for (let i = 1; i < 3; i++) {
    let userResponse1;
    let userResponse2;
    try {
      userResponse1 = await axios.get(`${baseUrl}${endpoint}${userId + i}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 403 ||
          error.response.status === 404 ||
          error.response.status === 422 ||
          error.response.status === 401)
      ) {
        continue;
      } else {
        console.error("Error:", error.message);
      }
    }
    try {
      userResponse2 = await axios.get(`${baseUrl}${endpoint}${userId - i}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 403 ||
          error.response.status === 404 ||
          error.response.status === 422 ||
          error.response.status === 401)
      ) {
        continue;
      } else {
        console.error("Error:", error.message);
        return { success: false, message: error.message };
      }
    }

    if (userResponse1.status === 200 || userResponse2.status === 200) {
      await Threats.deleteMany({
        endpoint: endpointId,
        name: "BOLA",
      });

      await Threats.create({
        endpoint: endpointId,
        name: "BOLA",
        description: "BOLA vulnerability found",
        type: "Authorization",
        severity: "High",
        recommendations: "Implement user specific authorization checks",
        status: "Pending",
      });
      return { success: false, message: "BOLA vulnerability found" };
    }
  }
  return { success: true, message: "BOLA vulnerability not found" };
}

export async function testBrokenAuth(
  baseUrl,
  endpoint,
  endpointId,
  method = "GET",
  payload = {}
) {
  try {
    let response;
    switch (method.toUpperCase()) {
      case "GET":
        response = await axios.get(`${baseUrl}${endpoint}`);
        break;
      case "POST":
        response = await axios.post(`${baseUrl}${endpoint}`, payload);
        break;
      case "PUT":
        response = await axios.put(`${baseUrl}${endpoint}`, payload);
        break;
      case "DELETE":
        response = await axios.delete(`${baseUrl}${endpoint}`);
        break;
      default:
        response = await axios.get(`${baseUrl}${endpoint}`);
        break;
    }
    if (response.status === 200) {
      await Threats.deleteMany({
        endpoint: endpointId,
        name: "Broken Authentication",
      });

      await Threats.create({
        endpoint: endpointId,
        name: "Broken Authentication",
        description: "Broken Authentication vulnerability found",
        type: "Authentication",
        severity: "High",
        recommendations: "Secure endpoint with token based authentication",
        status: "Pending",
      });
      return {
        success: false,
        message: "Broken Authentication vulnerability found",
      };
    }
  } catch (error) {
    if (
      error.response &&
      (error.response.status === 403 ||
        error.response.status === 404 ||
        error.response.status === 422 ||
        error.response.status === 401)
    ) {
    } else {
      console.error("Error:", error.message);
      return { success: false, message: error.message };
    }
  }
  try {
    const token = maketoken(16);
    let response;
    switch (method.toUpperCase()) {
      case "GET":
        response = await axios.get(`${baseUrl}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        break;
      case "POST":
        response = await axios.post(`${baseUrl}${endpoint}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        break;
      case "PUT":
        response = await axios.put(`${baseUrl}${endpoint}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        break;
      case "DELETE":
        response = await axios.delete(`${baseUrl}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        break;
      default:
        response = await axios.get(`${baseUrl}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        break;
    }
    if (response.status === 200) {
      await Threats.deleteMany({
        endpoint: endpointId,
        name: "Broken Authentication",
      });

      await Threats.create({
        endpoint: endpointId,
        name: "Broken Authentication",
        description: "Broken Authentication vulnerability found",
        type: "Authentication",
        severity: "High",
        recommendations: "Do not accept invalid tokens",
        status: "Pending",
      });
      return {
        success: false,
        message: "Broken Authentication vulnerability found",
      };
    }
  } catch (error) {
    if (
      error.response &&
      (error.response.status === 403 ||
        error.response.status === 404 ||
        error.response.status === 422 ||
        error.response.status === 401)
    ) {
    } else {
      console.error("Error:", error.message);
      return { success: false, message: error.message };
    }
  }
  return {
    success: true,
    message: "Broken Authentication vulnerability not found",
  };
}

export async function testPasswordLeak(
  endpoint,
  token,
  endpointId,
  method = "GET",
  payload = {}
) {
  try {
    let response;
    switch (method.toUpperCase()) {
      case "GET":
        response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        break;
      case "POST":
        response = await axios.post(endpoint, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        break;
      case "PUT":
        response = await axios.put(endpoint, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        break;
      case "DELETE":
        response = await axios.delete(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        break;
      default:
        response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    }
    if (response.status === 200) {
      const regex = /.*_password|pass|password|hashed_password/i;
      if (regex.test(JSON.stringify(response.data))) {
        await Threats.deleteMany({
          endpoint: endpointId,
          name: "Excessive Data Exposure",
        });

        await Threats.create({
          endpoint: endpointId,
          name: "Excessive Data Exposure",
          description: "Password leak vulnerability found",
          type: "Data Exposure",
          severity: "Medium",
          recommendations: "Do not expose passwords in response",
          status: "Pending",
        });

        // extract password from payload
        let password = "";
        for (const key in response.data) {
          if (regex.test(key)) {
            password = response.data[key];
            break;
          }
        }

        if (!checkIsHashed(password)) {
          await Threats.deleteMany({
            endpoint: endpointId,
            name: "Unhashed Password",
          });
          await Threats.create({
            endpoint: endpointId,
            name: "Unhashed Password",
            description: "Unhashed password found",
            type: "Data Exposure",
            severity: "High",
            recommendations: "Hash passwords before storing them",
            status: "Pending",
          });
        }

        return { success: false, message: "Password leak vulnerability found" };
      }
    }
    return { success: true, message: "Password leak vulnerability not found" };
  } catch (error) {
    console.error("Error:", error.message);

    if (error.response && error.response.status === 401) {
      return { success: false, message: "Inconclusive, Invalid credentials" };
    }

    return { success: false, message: error.message };
  }
}

export async function testSecurityHeaders(
  baseUrl,
  endpoint,
  token,
  endpointId,
  method = "GET",
  payload = {}
) {
  // Define the required headers
  const requiredHeaders = [
    "content-security-policy",
    "strict-transport-security",
    "x-frame-options",
    "x-content-type-options",
    "x-xss-protection",
    "referrer-policy",
    "permissions-policy",
  ];

  try {
    let response;
    switch (method.toUpperCase()) {
      case "GET":
        response = await axios.get(`${baseUrl}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        break;
      case "POST":
        response = await axios.post(`${baseUrl}${endpoint}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        break;
      case "PUT":
        response = await axios.put(`${baseUrl}${endpoint}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        break;
      case "DELETE":
        response = await axios.delete(`${baseUrl}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        break;
      default:
        response = await axios.get(`${baseUrl}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    }

    // Check if required headers are present
    const missingHeaders = requiredHeaders.filter(
      (header) => !(header in response.headers)
    );

    if (missingHeaders.length === 0) {
      return { success: true, message: "All required headers are present." };
    } else {
      await Threats.deleteMany({
        endpoint: endpointId,
        name: "Security Headers",
      });

      await Threats.create({
        endpoint: endpointId,
        name: "Security Headers",
        description: "Security headers missing",
        type: "Security",
        severity: "Medium",
        recommendations: "Add required security headers",
        status: "Pending",
      });
      return { success: false, message: "Missing headers:", missingHeaders };
    }
  } catch (error) {
    console.log(payload);
    console.error("Error:", error.message);
    return { success: false, message: error.message };
  }
}

export async function testParamLimits(
  baseUrl,
  endpoint,
  token,
  endpointId,
  payload
) {
  if (Object.keys(payload).length === 0) {
    return { success: true, message: "No payload provided" };
  }
  const excessivePayload = {};
  for (const key in payload) {
    if (typeof payload[key] === "string") {
      excessivePayload[key] = excessiveString;
    } else if (Array.isArray(payload[key])) {
      excessivePayload[key] = excessiveArray;
    } else if (typeof payload[key] === "object") {
      excessivePayload[key] = excessiveObject;
    } else {
      excessivePayload[key] = payload[key];
    }
  }
  try {
    const response = await axios.post(
      `${baseUrl}${endpoint}`,
      excessivePayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      await Threats.deleteMany({
        endpoint: endpointId,
        name: "Unrestricted Resource Consumption",
      });

      await Threats.create({
        endpoint: endpointId,
        name: "Unrestricted Resource Consumption",
        description: "Parameter limit vulnerability found",
        type: "Unrestricted Resource Consumption",
        severity: "Medium",
        recommendations: "Limit the size of request parameters",
        status: "Pending",
      });
      return { success: false, message: "Parameter limit vulnerability found" };
    }
  } catch (error) {
    if (error.response && error.response.status === 422) {
      return {
        success: true,
        message: "Parameter limit vulnerability not found",
      };
    } else {
      console.error("Error:", error.message);
      return { success: false, message: error.message };
    }
  }
}

// // Example usage
// const baseUrl = "http://localhost:8000";
// const endpoint = "/cart/1";
// const userToken =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb2huQGV4YW1wbGUuY29tIiwiZXhwIjoxNzI1NzAxMzIzfQ.MCn5rsDfwf59DN-qWdTE402AEarqsfLQ8_uA5K1CqYg"; // Token for User 1
// const userId = 1;

// testBOLA(baseUrl, endpoint, userToken, userId);
// testPasswordLeak("http://localhost:8000/cart/1", userToken);
// testBrokenAuth(baseUrl, endpoint, "GET");
