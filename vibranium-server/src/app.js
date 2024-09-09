import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import endpointsRoutes from "./routes/endpoints.routes.js";
import threatsRoutes from "./routes/threats.routes.js";
import organizationRoutes from "./routes/organization.routes.js";
import collectionRoutes from "./routes/collection.routes.js";
import testRoutes from "./routes/test.routes.js";
import lintRoutes from "./routes/lint.routes.js";
import { FRONTEND_URL } from "./config.js";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: FRONTEND_URL,
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/endpoints", endpointsRoutes);
app.use("/api/threats", threatsRoutes);
app.use("/api/test", testRoutes);
app.use("/api/lint", lintRoutes);

export default app;
