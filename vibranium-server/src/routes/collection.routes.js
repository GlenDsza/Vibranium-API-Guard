import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import {
  createCollection,
  deleteCollection,
  getCollections,
  updateCollection,
} from "../controllers/collections.controller.js";

const router = Router();

router.get("/", getCollections);
router.post("/", createCollection);
router.put("/:id", auth, updateCollection);
router.delete("/:id", auth, deleteCollection);

export default router;
