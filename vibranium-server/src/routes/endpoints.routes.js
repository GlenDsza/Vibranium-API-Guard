import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import {
  getEndpoints,
  ingestEndpoints,
} from "../controllers/endpoints.controller.js";

const router = Router();

router.get("/", auth, getEndpoints);
router.post("/ingest", ingestEndpoints);

export default router;
