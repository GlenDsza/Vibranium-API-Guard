import { Router } from "express";
import {
  testEndpoint,
  getTests,
  deleteTest,
  getDashboradData,
} from "../controllers/test.controller.js";
const router = Router();

router.get("/", getTests);
router.get("/dashboard", getDashboradData);
router.post("/:id", testEndpoint);
router.delete("/:id", deleteTest);

export default router;
