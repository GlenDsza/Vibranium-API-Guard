import { Router } from "express";
import { lint } from "../controllers/lint.controller.js";

const router = Router();

router.post("/linter", lint);

export default router;