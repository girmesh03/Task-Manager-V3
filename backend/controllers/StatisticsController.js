import asyncHandler from "express-async-handler";
import Task from "../models/TaskModel.js";
import CustomError from "../utils/CustomError.js";
import User from "../models/UserModel.js";
import Department from "../models/DepartmentModel.js";
import { calculatePerformance } from "../utils/TaskHelpers.js";
import { getTaskStatusStatistics, getLeaderboardData } from "../utils/PipeLines.js";


// @desc Get statistics
// @route GET /api/statistics
// @access Private
const getDashboardStats = asyncHandler(async (req, res, next) => {
  const { selectedDepartment, limit, currentDate } = req.query;

  const department = await Department.findById(selectedDepartment);
  if (!department) {
    return next(new CustomError("Department not found", 404));
  }

  const today = new Date(currentDate); // Enforce local time interpretation
  const sixMonthsAgo = new Date(currentDate);

  // Check if currentDate is a valid date
  if (isNaN(today.getTime()) || isNaN(sixMonthsAgo.getTime())) {
    throw new CustomError("Invalid date format", 400);
  }

  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

  const last30DaysStart = new Date(today);
  last30DaysStart.setDate(last30DaysStart.getDate() - 29);

  const previous30DaysStart = new Date(last30DaysStart);
  previous30DaysStart.setDate(previous30DaysStart.getDate() - 30);
  const previous30DaysEnd = new Date(last30DaysStart);
  previous30DaysEnd.setDate(previous30DaysEnd.getDate() - 1);

  const daysInLast30 = [];
  // Create date range array for Last 30 Days
  const dateRange = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(last30DaysStart);
    date.setDate(date.getDate() + i);
    daysInLast30.push(
      date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    );
    return date.toISOString().split("T")[0];
  });

  try {

    const taskStatusStatistics = await getTaskStatusStatistics(
      last30DaysStart, today, previous30DaysStart, previous30DaysEnd, dateRange, daysInLast30, department._id);

    const lastSixMonthData = await Task.aggregate([
      {
        // Match tasks within the last six months
        $match: {
          date: { $gte: sixMonthsAgo, $lte: today },
          department: department._id,
        },
      },
      {
        // Add a field to represent the month in short format (e.g., Jan, Feb)
        $addFields: {
          month: { $dateToString: { format: "%b", date: "$date" } },
        },
      },
      {
        // Group tasks by month and status, and count the occurrences
        $group: {
          _id: {
            month: "$month", // Group by month
            status: "$status", // Group by task status
          },
          count: { $sum: 1 }, // Count the number of tasks in each group
        },
      },
      {
        // Re-group by month and calculate task counts for each status
        $group: {
          _id: "$_id.month",
          Completed: {
            $sum: {
              $cond: [{ $eq: ["$_id.status", "Completed"] }, "$count", 0], // Sum completed tasks
            },
          },
          "In Progress": {
            $sum: {
              $cond: [{ $eq: ["$_id.status", "In Progress"] }, "$count", 0], // Sum in-progress tasks
            },
          },
          Pending: {
            $sum: {
              $cond: [{ $eq: ["$_id.status", "Pending"] }, "$count", 0], // Sum pending tasks
            },
          },
          "To Do": {
            $sum: {
              $cond: [{ $eq: ["$_id.status", "To Do"] }, "$count", 0], // Sum to-do tasks
            },
          },
        },
      },
      {
        // Project the final result in a more structured form
        $project: {
          _id: 0, // Exclude the default _id field
          month: "$_id", // Rename _id to month for easier access
          Completed: 1,
          "In Progress": 1,
          Pending: 1,
          "To Do": 1,
        },
      },
      {
        // Sort by month to ensure chronological order (e.g., Jan, Feb, Mar, etc.)
        $sort: { month: 1 },
      },
    ]);

    // Get the last six months in short format (e.g., Jan, Feb, Mar, etc.)
    const lastSixMonths = [...Array(6)].map((_, i) =>
      new Date(new Date().setMonth(new Date().getMonth() - (5 - i))).toLocaleString("en-US", {
        month: "short",
      })
    );

    // Create an empty result structure to hold the final seriesData
    const seriesData = {
      Completed: new Array(6).fill(0),
      "In Progress": new Array(6).fill(0),
      Pending: new Array(6).fill(0),
      "To Do": new Array(6).fill(0),
    };

    // Fill the seriesData with the aggregated results
    lastSixMonthData.forEach((item) => {
      const monthIndex = lastSixMonths.indexOf(item.month); // Find the index of the month
      if (monthIndex !== -1) {
        seriesData.Completed[monthIndex] = item.Completed || 0;
        seriesData["In Progress"][monthIndex] = item["In Progress"] || 0;
        seriesData.Pending[monthIndex] = item.Pending || 0;
        seriesData["To Do"][monthIndex] = item["To Do"] || 0;
      }
    });

    const performance = calculatePerformance(seriesData);
    const leaderboard = await getLeaderboardData(last30DaysStart, today, department._id, limit);

    res.status(200).json({ statData: taskStatusStatistics, seriesData, lastSixMonths, daysInLast30, performance, leaderboard });

  } catch (error) {
    next(error);
  }
});


// @desc Get users statistics
// @route GET /api/statistics/user
// @access Private
const getUserStatistics = asyncHandler(async (req, res, next) => {
  try {
    const { selectedDepartment, userId, currentDate } = req.query;

    const department = await Department.findById(selectedDepartment);
    if (!department) return next(new CustomError("Department not found", 404));

    const user = await User.findById(userId);
    if (!user) return next(new CustomError("User not found", 404));

    // Check if currentDate is a valid date
    const today = new Date(currentDate);
    if (isNaN(today.getTime())) {
      throw new CustomError("Invalid date format", 400);
    }

    const last30DaysStart = new Date(today);
    last30DaysStart.setDate(last30DaysStart.getDate() - 29);

    const leaderboard = await getLeaderboardData(last30DaysStart, today, department._id);

    const userStat = leaderboard.find(stat => stat._id.toString() === userId) || {};

    res.status(200).json(userStat);
  } catch (error) {
    next(error);
  }
});


// @desc Get leaderboard statistics
// @route GET /api/statistics/leaderboard
// @access Private
const getLeaderboardStats = asyncHandler(async (req, res, next) => {
  try {

    const { currentDate, selectedDepartment } = req.query;

    const department = await Department.findById(selectedDepartment);
    if (!department) {
      return next(new CustomError("Department not found", 404));
    }

    // Check if currentDate is a valid date
    const today = new Date(currentDate)
    if (isNaN(today.getTime())) {
      return next(new CustomError("Invalid date format", 400));
    }

    const last30DaysStart = new Date(today);
    last30DaysStart.setDate(last30DaysStart.getDate() - 29);

    const leaderboard = await getLeaderboardData(last30DaysStart, today, department._id);

    res.status(200).json(leaderboard);
  } catch (error) {
    next(error);
  }
});

export { getDashboardStats, getUserStatistics, getLeaderboardStats };
