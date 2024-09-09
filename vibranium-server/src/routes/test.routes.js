import { Router } from "express";
import {
  testEndpoint,
  getTests,
  deleteTest,
} from "../controllers/test.controller.js";
const router = Router();

router.get("/", getTests);
router.post("/:id", testEndpoint);
router.delete("/:id", deleteTest);

export default router;
