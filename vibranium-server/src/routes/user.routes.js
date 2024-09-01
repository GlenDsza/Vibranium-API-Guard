import { Router } from "express";
import {
  deleteSingleUser,
  deleteAllUsers,
  getUsers,
} from "../controllers/users.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getUsers);
router.delete("/:userId", auth, deleteSingleUser);
router.delete("/", auth, deleteAllUsers);

export default router;
