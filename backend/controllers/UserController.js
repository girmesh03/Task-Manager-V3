import asyncHandler from "express-async-handler";
import CustomError from "../utils/CustomError.js";
import User from "../models/UserModel.js";
import Department from "../models/DepartmentModel.js";

// @desc Get users
// @route GET /api/users
// @access Private
const getUsers = asyncHandler(async (req, res, next) => {
  const { selectedDepartment } = req.query;

  const departments = await Department.findById(selectedDepartment);
  if (!departments) {
    return next(new CustomError("Department not found", 404));
  }

  const users = await User.find({ department: selectedDepartment }).sort({ createdAt: -1 });
  res.status(200).json(users);
});

// @desc Get user
// @route GET /api/users/:userId
// @access Private
const getUser = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { selectedDepartment } = req.query;

  const department = await Department.findById(selectedDepartment);
  if (!department) {
    return next(new CustomError("Department not found", 404));
  }
  const user = await User.findById(userId);

  if (!user) {
    return next(new CustomError("User not found", 404));
  }

  res.status(200).json(user);
});

export { getUsers, getUser };
