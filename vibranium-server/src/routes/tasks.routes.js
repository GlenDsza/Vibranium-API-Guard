import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from "../controllers/tasks.controllers.js";
import { auth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createTaskSchema } from "../schemas/task.schema.js";

const router = Router();

router.get("/", auth, getTasks);

router.post("/", auth, validateSchema(createTaskSchema), createTask);

router.get("/:id", auth, getTask);

router.put("/:id", auth, updateTask);

router.delete("/:id", auth, deleteTask);

export default router;
