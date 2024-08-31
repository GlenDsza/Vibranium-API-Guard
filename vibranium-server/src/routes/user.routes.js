import { Router } from "express";
import {
  getSingleUser,
  getAllUsers,
  deleteSingleUser,
  deleteAllUsers,
} from "../controllers/users.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/:userId", getSingleUser);
router.get("/", getAllUsers);
router.delete("/:userId", auth, deleteSingleUser);
router.delete("/", auth, deleteAllUsers);

export default router;
