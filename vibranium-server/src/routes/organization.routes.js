import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import {
  createOrganization,
  deleteOrganization,
  getOrganizations,
  updateOrganization,
} from "../controllers/organizations.controller.js";

const router = Router();

router.get("/", getOrganizations);
router.post("/", createOrganization);
router.delete("/:id", auth, deleteOrganization);
router.put("/:id", updateOrganization);

export default router;
