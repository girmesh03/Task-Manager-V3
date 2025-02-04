import asyncHandler from "express-async-handler";
import CustomError from "../utils/CustomError.js";
import Task from "../models/TaskModel.js";

// @desc Create task
// @route POST /api/tasks
// @access Private
const createTask = asyncHandler(async (req, res, next) => {
  const task = req.body;

  try {
    // Create the new task
    const newTask = await Task.create({
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
  const tasks = await Task.find({})
    .populate({
      path: "assignedTo",
      select: "-password",
    })
    .populate({
      path: "activities.performedBy",
      select: "-password",
    })
    .sort({ createdAt: -1 });

  res.status(200).json(tasks);
});

// @desc Get task
// @route PUT /api/tasks/:taskId
// @access Private
const getTask = asyncHandler(async (req, res, next) => {
  const { taskId } = req.params;
  console.log("taskId", taskId);
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

  res.status(200).json(task);
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

  try {
    // Find and delete the task by ID
    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
      return next(new CustomError("Task not found", 404));
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export { createTask, getTasks, getTask, updateTask, deleteTask };
