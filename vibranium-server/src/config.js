import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 4000;
export const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb+srv://admin:admin@cluster0.yvtlv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
export const TOKEN_SECRET = process.env.TOKEN_SECRET || "secret";

export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
