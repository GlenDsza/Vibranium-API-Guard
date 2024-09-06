import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import {
  createOrganization,
  deleteOrganization,
  getOrganizations,
  updateOrganization,
  blockUnblockIp,
  getBlockedIps,
} from "../controllers/organizations.controller.js";

const router = Router();

router.get("/", getOrganizations);
router.get("/:id/blockedips", getBlockedIps);
router.post("/", createOrganization);
router.delete("/:id", auth, deleteOrganization);
router.put("/:id", updateOrganization);
router.put("/:id/blockedips", blockUnblockIp);

export default router;
