const mongoose = require("mongoose");

const trafficSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    enum: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
    required: true,
  },
  statusCode: {
    type: Number,
    required: true,
  },
  requestHeaders: {
    type: Map,
    of: String,
  },
  responseHeaders: {
    type: Map,
    of: String,
  },
  userAgent: {
    type: String,
  },
  referrer: {
    type: String,
  },
  body: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Optional fields for geolocation or additional info
  geoLocation: {
    country: String,
    region: String,
    city: String,
    lat: Number,
    long: Number,
  },
});

export default mongoose.model("traffic", trafficSchema);
