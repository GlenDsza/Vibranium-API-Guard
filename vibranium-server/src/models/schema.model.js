import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  anyOf: {
    type: [mongoose.Schema.Types.Mixed],
    default: undefined,
  },
  items: {
    type: mongoose.Schema.Types.Mixed,
    default: undefined,
  },
});

const schemaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  properties: {
    type: [propertySchema],
    required: true,
  },
  required: {
    type: [String],
    default: undefined,
  },
});

export default mongoose.model("Schema", schemaSchema);
