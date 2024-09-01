import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    logo: {
      type: String,
      required: true,
      trim: true,
    },
    blockedIps: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Organization", organizationSchema);
