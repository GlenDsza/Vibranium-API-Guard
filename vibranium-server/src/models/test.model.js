import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    endpoint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Endpoint",
      required: true,
    },
    testsPerformed: {
      type: Number,
      required: true,
    },
    testsPassed: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Test", testSchema);
