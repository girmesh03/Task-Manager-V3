import asyncHandler from "express-async-handler";
import CustomError from "../utils/CustomError.js";
import Task from "../models/TaskModel.js";
import User from "../models/UserModel.js";
import Department from "../models/DepartmentModel.js";

// @desc Create task
// @route POST /api/tasks
// @access Private
const createTask = asyncHandler(async (req, res, next) => {
  const task = req.body;

  try {
    // Create the new task
    const newTask = await Task.create({
      department: task.departmentId,
      title: task.title,
      description: task.description,
      status: task.status,
      date: task.date,
      location: task.location,
      assignedTo: task.assignedTo,
      priority: task.priority,
      category: task.category,
    });

    // Find and populate the created task
    const response = await Task.findById(newTask._id).populate({
      path: "assignedTo",
      select: "-password",
    });

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

// @desc Get tasks
// @route GET /api/tasks
// @access Private
const getTasks = asyncHandler(async (req, res, next) => {
  const { status, page = 1, limit = 10, selectedDepartment } = req.query; // Default to page 1 and limit 10

  // Start with a filter based on status if provided
  const filter = status ? { status } : {};

  // Add the department filter so that only tasks for the selected department are returned.
  // Make sure your Task model includes a 'department' field.
  filter.department = selectedDepartment;

  // Convert page and limit to integers and ensure they're valid
  const pageNumber = parseInt(page, 10);
  const pageLimit = parseInt(limit, 10);

  if (isNaN(pageNumber) || isNaN(pageLimit) || pageNumber <= 0 || pageLimit <= 0) {
    return res.status(400).json({ message: "Invalid page or limit value" });
  }

  // Check if the selected department exists
  const department = await Department.findById(selectedDepartment);
  if (!department) {
    return next(new CustomError("Department not found", 404));
  }

  const skip = (pageNumber - 1) * pageLimit; // Calculate the number of tasks to skip

  try {
    // Get tasks based on filter, sorted by created date
    const tasks = await Task.find(filter)
      .populate({
        path: "assignedTo",
        select: "-password",
      })
      .populate({
        path: "activities.performedBy",
        select: "-password",
      })
      .sort({ createdAt: -1 })
      .skip(skip) // Skip the tasks for pagination
      .limit(pageLimit); // Limit the number of tasks per page

    // Count the total number of tasks based on the filter
    const totalTasks = await Task.countDocuments(filter);

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalTasks / pageLimit);

    // Respond with the tasks and pagination info
    res.status(200).json({
      tasks,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalTasks,
      },
    });
  } catch (error) {
    next(error);
  }
});


// @desc Get task
// @route GET /api/tasks/:taskId
// @access Private
const getTask = asyncHandler(async (req, res, next) => {
  const { taskId } = req.params;

  const task = await Task.findById(taskId)
    .populate({
      path: "assignedTo",
      select: "-password",
    })
    .populate({
      path: "activities.performedBy",
      select: "-password",
    });

  if (!task) {
    return next(new CustomError("Task not found", 404));
  }

  const users = await User.find({});
  // const taskData = { ...task._doc, description: formatTaskDescription(task.description) }
  // const response = { task: taskData, users }
  const response = { task, users }
  res.status(200).json(response);
});

// @desc Update task
// @route PUT /api/tasks/:taskId
// @access Private
const updateTask = asyncHandler(async (req, res, next) => {
  const { taskId } = req.params;
  const updates = req.body;

  try {
    // Find the task by ID and apply the updates
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate({
        path: "assignedTo",
        select: "-password", // Exclude sensitive data
      })
      .populate({
        path: "activities.performedBy",
        select: "-password", // Exclude sensitive data
      });

    if (!updatedTask) {
      return next(new CustomError("Task not found", 404));
    }

    // const taskData = { ...updatedTask._doc, description: formatTaskDescription(updatedTask.description) }
    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
});

// @desc Delete task
// @route DELETE /api/tasks/:taskId
// @access Private
const deleteTask = asyncHandler(async (req, res, next) => {
  const { taskId } = req.params;
  const { selectedDepartment: departmentId } = req.query;

  const department = await Department.findById(departmentId);
  if (!department) {
    return next(new CustomError("Department not found", 404));
  }

  try {
    // Find and delete the task by ID
    const task = await Task.findOneAndDelete({ _id: taskId, department: department._id });

    if (!task) {
      return next(new CustomError("Task not found", 404));
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export { createTask, getTasks, getTask, updateTask, deleteTask };
