import express from "express";
import {
  getDepartments, createDepartment,
  updateDepartment, deleteDepartment
} from "../controllers/DepartmentController.js";

const router = express.Router();

router.get("/", getDepartments);
router.post("/", createDepartment);
router.put("/:departmentId", updateDepartment);
router.delete("/:departmentId", deleteDepartment);

export default router;
