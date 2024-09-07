import axios from "axios";
import Threats from "../models/threat.model.js";

function maketoken(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

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

// // Example usage
// const baseUrl = "http://localhost:8000";
// const endpoint = "/cart/1";
// const userToken =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb2huQGV4YW1wbGUuY29tIiwiZXhwIjoxNzI1NzAxMzIzfQ.MCn5rsDfwf59DN-qWdTE402AEarqsfLQ8_uA5K1CqYg"; // Token for User 1
// const userId = 1;

// testBOLA(baseUrl, endpoint, userToken, userId);
// testPasswordLeak("http://localhost:8000/cart/1", userToken);
// testBrokenAuth(baseUrl, endpoint, "GET");
