import mongoose from "mongoose";

const parameterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  in: { type: String, required: true },
  required: { type: Boolean, required: true },
  schemaRef: {
    type: { type: String, required: true },
    title: { type: String, required: true },
  },
});

const endpointSchema = new mongoose.Schema({
  path: { type: String, required: true },
  method: {
    type: String,
    required: true,
    enum: ["get", "post", "put", "patch", "delete"],
  },
  summary: { type: String, required: true },
  operationId: { type: String, required: true },
  parameters: [parameterSchema],
  requestBody: {
    content: {
      "application/json": {
        schemaRef: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Schema",
          required: true,
        },
      },
    },
    required: { type: Boolean, required: true },
  },
  responses: {
    type: Map,
    of: {
      description: { type: String, required: true },
      content: {
        "application/json": {
          schemaRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Schema",
            required: false,
          },
        },
      },
    },
  },
});

export default mongoose.model("Endpoint", endpointSchema);
