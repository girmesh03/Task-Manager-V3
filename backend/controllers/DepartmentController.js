import asyncHandler from "express-async-handler";
import CustomError from "../utils/CustomError.js";
import Department from "../models/DepartmentModel.js";

// @desc Create Department
// @route POST /api/departments
// @access Private
const createDepartment = asyncHandler(async (req, res, next) => {
  const { name } = req.body
  try {
    const department = await Department.findOne({ name });
    if (department) {
      return next(new CustomError("Department already exists", 400));
    }

    const newDepartment = await Department.create({ name })

    res.status(201).json(newDepartment)
  } catch (error) {
    next(error)
  }
})


// @desc Get departments
// @route GET /api/departments
// @access Private
const getDepartments = asyncHandler(async (req, res, next) => {
  try {
    const departments = await Department.find({});
    res.status(200).json(departments)
  } catch (error) {
    next(error)
  }
})


// @desc Update Department
// @route PUT /api/departments/:departmentId
// @access Private
const updateDepartment = asyncHandler(async (req, res, next) => {
  const { departmentId } = req.params
  const { name } = req.body
  try {
    const department = await Department.findById(departmentId)
    if (!department) {
      return next(new CustomError("Department not found", 404));
    }

    const updatedDepartment = await Department.findByIdAndUpdate(
      { _id: departmentId },
      { name },
      { new: true, runValidators: true }
    )

    res.status(200).json(updatedDepartment)
  } catch (error) {
    next(error)
  }
})


// @desc Delete Department
// @route DELETE /api/departments/:departmentId
// @access Private
const deleteDepartment = asyncHandler(async (req, res, next) => {
  try {

    res.status(200).json({ message: 'Department deleted' })
  } catch (error) {
    next(error)
  }
})

export { getDepartments, createDepartment, updateDepartment, deleteDepartment };
