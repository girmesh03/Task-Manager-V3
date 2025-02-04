import express from "express";
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
} from "../controllers/TaskController.js";

const router = express.Router();

router.post("/", createTask);
router.get("/", getTasks);
router.get("/:taskId", getTask);
router.put("/:taskId", updateTask);
router.delete("/:taskId", deleteTask);

export default router;
