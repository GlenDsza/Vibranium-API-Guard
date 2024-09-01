import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
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
  },
  {
    _id: false,
    timestamps: true,
  }
);

const schemaSchema = new mongoose.Schema(
  {
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
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      default: "66d3f5019ce5c53aeb973d6e",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Schema", schemaSchema);
