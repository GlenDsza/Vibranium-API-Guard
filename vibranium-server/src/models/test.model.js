import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  [
    {
      endpoint: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Endpoint",
        required: true,
      },
      testsPerformed: [
        {
          testName: {
            type: String,
            required: true,
          },
          testSuccess: {
            type: Boolean,
            required: true,
          },
        },
      ],
    },
  ],
  {
    timestamps: true,
  }
);

export default mongoose.model("Test", testSchema);
