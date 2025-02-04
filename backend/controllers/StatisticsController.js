import asyncHandler from "express-async-handler";
// import CustomError from "../utils/CustomError.js";
import Task from "../models/TaskModel.js";

import { calculatePerformance } from "../utils/TaskHelpers.js";

// @desc Get statistics
// @route GET /api/statistics
// @access Private
const getStatistics = asyncHandler(async (req, res, next) => {
  const today = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

  const last30DaysStart = new Date(today);
  last30DaysStart.setDate(last30DaysStart.getDate() - 30);

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
      date.toLocaleDateString("en-US", { weekday: "short", day: "numeric" })
    );
    return date.toISOString().split("T")[0];
  });


  try {

    const statistics = await Task.aggregate([
      // Match tasks within the last 30 days
      {
        $match: {
          date: { $gte: last30DaysStart, $lte: today },
        },
      },
      {
        $addFields: {
          day: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        },
      },
      {
        $group: {
          _id: { status: "$status", day: "$day" },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.status",
          dailyCounts: {
            $push: {
              day: "$_id.day",
              count: "$count",
            },
          },
          last30DaysCount: { $sum: "$count" },
        },
      },
      // Lookup tasks from previous 30 days
      {
        $lookup: {
          from: "tasks",
          let: { status: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$status", "$$status"] },
                date: { $gte: previous30DaysStart, $lte: previous30DaysEnd },
              },
            },
            {
              $group: {
                _id: null,
                previous30DaysCount: { $sum: 1 },
              },
            },
          ],
          as: "previousData",
        },
      },
      {
        $addFields: {
          previous30DaysCount: {
            $ifNull: [{ $arrayElemAt: ["$previousData.previous30DaysCount", 0] }, 0],
          },
        },
      },
      {
        $addFields: {
          trend: {
            $switch: {
              branches: [
                {
                  case: { $eq: ["$_id", "Completed"] },
                  then: {
                    $cond: {
                      if: { $gt: ["$last30DaysCount", "$previous30DaysCount"] },
                      then: "up",
                      else: {
                        $cond: {
                          if: { $lt: ["$last30DaysCount", "$previous30DaysCount"] },
                          then: "down",
                          else: "neutral"
                        }
                      }
                    }
                  }
                },
                {
                  case: { $in: ["$_id", ["Pending", "In Progress", "To Do"]] },
                  then: {
                    $cond: {
                      if: { $lt: ["$last30DaysCount", "$previous30DaysCount"] },
                      then: "up",
                      else: {
                        $cond: {
                          if: { $gt: ["$last30DaysCount", "$previous30DaysCount"] },
                          then: "down",
                          else: "neutral"
                        }
                      }
                    }
                  }
                }
              ],
              default: "neutral"
            }
          },
        },
      },
      // Ensure all days have data (fill missing days with 0)
      {
        $project: {
          _id: 0,
          status: "$_id",
          last30DaysCount: 1,
          previous30DaysCount: 1,
          trend: 1,
          trendChange: {
            $cond: {
              if: { $eq: ["$previous30DaysCount", 0] },
              then: {
                $cond: {
                  if: { $eq: ["$last30DaysCount", 0] },
                  then: 0, // No change if both are 0.
                  else: {
                    $cond: {
                      if: { $eq: ["$_id", "Completed"] },
                      then: 100, // 100% increase is good for "Completed"
                      else: -100 // 100% increase is bad for "Pending", "In Progress", etc.
                    }
                  }
                }
              },
              else: {
                $let: {
                  vars: {
                    rawChange: {
                      $multiply: [
                        {
                          $divide: [
                            { $subtract: ["$last30DaysCount", "$previous30DaysCount"] },
                            "$previous30DaysCount"
                          ]
                        },
                        100
                      ]
                    }
                  },
                  in: {
                    $cond: {
                      if: { $eq: ["$_id", "Completed"] },
                      then: "$$rawChange", // Keep sign for Completed
                      else: { $multiply: ["$$rawChange", -1] } // Flip sign for others
                    }
                  }
                }
              }
            }
          },
          data: {
            $map: {
              input: dateRange,
              as: "date",
              in: {
                $let: {
                  vars: {
                    match: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$dailyCounts",
                            as: "dayData",
                            cond: { $eq: ["$$dayData.day", "$$date"] },
                          },
                        },
                        0,
                      ],
                    },
                  },
                  in: { $ifNull: ["$$match.count", 0] },
                },
              },
            },
          },
        },
      },
    ]);

    const last30DaysOverallStats = await Task.aggregate([
      {
        $match: {
          date: { $gte: last30DaysStart, $lte: today }
        }
      },
      {
        $group: {
          _id: "$status",
          totalTasks: { $sum: 1 },
        },
      },
    ]);

    const totalTasks = last30DaysOverallStats.reduce((sum, stat) => sum + stat.totalTasks, 0);
    const completedTasks = last30DaysOverallStats.find(stat => stat._id === "Completed")?.totalTasks || 0;
    const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const last30DaysOverall = {
      totalTasks,
      completedTasks,
      overallProgress,
    };

    // Ensure all statuses are included(even if there was no data)
    const allStatuses = ["Completed", "In Progress", "Pending", "To Do"]; // Define your status types here
    const statData = allStatuses.map(status => {
      const stat = statistics.find(stat => stat.status === status);
      if (!stat) {
        // If no data for this status, return with 0 values
        return {
          title: status,
          value: "0",
          previous30DaysCount: '0',
          interval: "Last 30 days",
          trend: "neutral",
          trendChange: "0.0%",
          data: Array(30).fill(0),
        };
      }
      return {
        title: stat.status,
        value:
          stat.last30DaysCount > 999
            ? `${(stat.last30DaysCount / 1000).toFixed(1)}k`
            : stat.last30DaysCount.toString(),
        previous30DaysCount: stat.previous30DaysCount > 999
          ? `${(stat.previous30DaysCount / 1000).toFixed(1)}k`
          : stat.previous30DaysCount.toString(),
        interval: "Last 30 days",
        trend: stat.trend,
        trendChange: `${stat.trendChange.toFixed(1)}%`,
        data: stat.data,
      };
    });


    const taskData = await Task.aggregate([
      {
        $match: {
          date: { $gte: sixMonthsAgo, $lte: today }
        }
      },
      {
        $group: {
          _id: {
            month: { $dateToString: { format: "%b", date: "$date" } },
            status: "$status",
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.month",
          Completed: { $sum: { $cond: [{ $eq: ["$_id.status", "Completed"] }, "$count", 0] } },
          "In Progress": { $sum: { $cond: [{ $eq: ["$_id.status", "In Progress"] }, "$count", 0] } },
          Pending: { $sum: { $cond: [{ $eq: ["$_id.status", "Pending"] }, "$count", 0] } },
          "To Do": { $sum: { $cond: [{ $eq: ["$_id.status", "To Do"] }, "$count", 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const lastSixMonths = [...Array(6)].map((_, i) =>
      new Date(new Date().setMonth(new Date().getMonth() - (5 - i))).toLocaleString("en-US", {
        month: "short",
      })
    );

    // // Initialize data structure
    const initialStats = lastSixMonths.reduce((acc, month) => {
      acc[month] = { Completed: 0, "In Progress": 0, Pending: 0, "To Do": 0 };
      return acc;
    }, {});

    taskData.forEach((item) => {
      initialStats[item._id] = {
        Completed: item.Completed || 0,
        "In Progress": item["In Progress"] || 0,
        Pending: item.Pending || 0,
        "To Do": item["To Do"] || 0,
      };
    });

    const chartData = lastSixMonths.map((month) => {
      const stat = taskData.find((stat) => stat._id === month);
      if (!stat) {
        return {
          _id: month,
          ...initialStats[month],
        }
      }
      return stat;
    })

    const seriesData = {
      Completed: lastSixMonths.map((month) => initialStats[month].Completed),
      "In Progress": lastSixMonths.map((month) => initialStats[month]["In Progress"]),
      Pending: lastSixMonths.map((month) => initialStats[month].Pending),
      "To Do": lastSixMonths.map((month) => initialStats[month]["To Do"]),
    };

    const performance = calculatePerformance(seriesData);

    res.status(200).json({ statData, chartData, seriesData, lastSixMonths, daysInLast30, last30DaysOverall, performance });

  } catch (error) {
    next(error);
  }
});

export { getStatistics };
