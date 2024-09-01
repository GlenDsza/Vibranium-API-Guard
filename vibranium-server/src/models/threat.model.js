import mongoose from "mongoose";

const threatSchema = new mongoose.Schema(
  {
    endpoint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Endpoint",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      required: true,
      enum: ["Low", "Medium", "High"],
    },
    recommendations: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Resolved"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Threat", threatSchema);
