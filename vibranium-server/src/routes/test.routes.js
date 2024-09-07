import { Router } from "express";
import {
  testEndpoint,
} from "../controllers/test.controller.js";
const router = Router();

router.post("/:id", testEndpoint);

export default router;
