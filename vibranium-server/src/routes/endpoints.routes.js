import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import {
  deleteEndpoint,
  deleteManyEndpoints,
  getEndpoints,
  ingestEndpoints,
  updateEndpoint,
} from "../controllers/endpoints.controller.js";

const router = Router();

router.get("/", auth, getEndpoints);
router.put("/:id", auth, updateEndpoint);
router.post("/ingest", ingestEndpoints);
router.delete("/:id", auth, deleteEndpoint);
router.delete("/deleteMany", auth, deleteManyEndpoints);

export default router;
