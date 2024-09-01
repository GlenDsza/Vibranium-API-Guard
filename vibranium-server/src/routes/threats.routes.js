import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import {
  createThreat,
  deleteThreat,
  getThreats,
  updateThreat,
} from "../controllers/threats.controller.js";

const router = Router();

router.get("/", getThreats);
router.post("/", createThreat);
router.put("/:id", updateThreat);
router.delete("/:id", auth, deleteThreat);

export default router;
