import { Router } from "express";
import { testEndpoint, getTests } from "../controllers/test.controller.js";
const router = Router();

router.get("/", getTests);
router.post("/:id", testEndpoint);

export default router;
