import Task from "../models/TaskModel.js";

export const getOverallData = async (currentStartDate, currentEndDate, departmentId) => {

  try {
    const pipeline = [
      {
        $match: {
          date: { $gte: currentStartDate, $lte: currentEndDate },
          department: departmentId,
        }
      },
      {
        $group: {
          _id: "$status",
          totalTasks: { $sum: 1 },
        },
      },
    ]

    const last30DaysOverallStats = await Task.aggregate(pipeline);

    const totalTasks = last30DaysOverallStats.reduce((sum, stat) => sum + stat.totalTasks, 0);
    const completedTasks = last30DaysOverallStats.find(stat => stat._id === "Completed")?.totalTasks || 0;
    const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const last30DaysOverall = {
      totalTasks,
      completedTasks,
      overallProgress,
    };

    return last30DaysOverall
  } catch (error) {
    throw error
  }
}

export const getTaskStatusStatistics = async (currentStartDate, currentEndDate, previousStartDate, previousEndDate, dateRange, daysInLast30, departmentId) => {

  const interval = `${daysInLast30[0]} - ${daysInLast30.reverse()[0]}`;

  try {

    const pipeline = [
      // Match tasks within the last 30 days
      {
        $match: {
          date: { $gte: currentStartDate, $lte: currentEndDate },
          department: departmentId
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
                date: { $gte: previousStartDate, $lte: previousEndDate },
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
                      if: { $gte: ["$last30DaysCount", "$previous30DaysCount"] },
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
    ]

    // Aggregate
    const taskStatusStatistics = await Task.aggregate(pipeline);

    // Ensure all statuses are included(even if there was no data)
    const allStatuses = ["Completed", "In Progress", "Pending", "To Do"];

    const formatedTaskStatusStatistics = allStatuses.map(status => {
      const stat = taskStatusStatistics.find(stat => stat.status === status);
      if (!stat) {
        // If no data for this status, return with 0 values
        return {
          title: status,
          value: "0",
          previous30DaysCount: "0",
          interval,
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
        interval,
        trend: stat.trend,
        trendChange: `${stat.trendChange.toFixed(1)}%`,
        data: stat.data,
      };
    });

    return formatedTaskStatusStatistics;

  } catch (error) {
    throw error
  }
}

export const getLeaderboardData = async (currentStartDate, currentEndDate, departmentId, limit) => {

  const parsedLimit = limit ? Number(limit) : null;
  const interval = `${currentStartDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${currentEndDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`

  try {
    const pipeline = [
      {
        $match: {
          date: { $gte: currentStartDate, $lte: currentEndDate },
          department: departmentId,
        }
      },
      { $unwind: "$assignedTo" },
      {
        $group: {
          _id: "$assignedTo",
          assignedTasks: { $sum: 1 },
          completedTasks: { $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] } },
          pendingTasks: { $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] } },
          inProgressTasks: { $sum: { $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0] } },
          toDoTasks: { $sum: { $cond: [{ $eq: ["$status", "To Do"] }, 1, 0] } },
          lowPriority: { $sum: { $cond: [{ $eq: ["$priority", "Low"] }, 1, 0] } },
          mediumPriority: { $sum: { $cond: [{ $eq: ["$priority", "Medium"] }, 1, 0] } },
          highPriority: { $sum: { $cond: [{ $eq: ["$priority", "High"] }, 1, 0] } },
          categoryCounts: { $push: "$category" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          weightedScore: {
            $add: [
              { $multiply: ["$completedTasks", 3] },
              { $multiply: ["$highPriority", 2] },
              { $multiply: ["$mediumPriority", 1] },
              { $multiply: ["$lowPriority", 0.5] }
            ]
          },
          categoriesWorkedOn: {
            categories: {
              $reduce: {
                input: "$categoryCounts",
                initialValue: [],
                in: { $setUnion: ["$$value", "$$this"] }
              }
            }
          }
        }
      },
      { $addFields: { "categoriesWorkedOn.size": { $size: "$categoriesWorkedOn.categories" } } },
      {
        $project: {
          _id: 1,
          firstName: "$userDetails.firstName",
          lastName: "$userDetails.lastName",
          email: "$userDetails.email",
          assignedTasks: 1,
          completedTasks: 1,
          pendingTasks: 1,
          inProgressTasks: 1,
          toDoTasks: 1,
          lowPriority: 1,
          mediumPriority: 1,
          highPriority: 1,
          weightedScore: 1,
          categoriesWorkedOn: 1
        }
      },
      { $sort: { weightedScore: -1 } },
      {
        $setWindowFields: {
          sortBy: { weightedScore: -1 },
          output: {
            rank: { $denseRank: {} },
            maxScore: { $max: "$weightedScore", window: { documents: ["unbounded", "unbounded"] } }
          }
        }
      },
      {
        $addFields: {
          rating: {
            $cond: {
              if: { $eq: ["$maxScore", 0] },
              then: 0,
              else: { $multiply: [{ $divide: ["$weightedScore", "$maxScore"] }, 5] }
            }
          },
          prioritization: {
            $switch: {
              branches: [
                { case: { $gte: ["$highPriority", "$mediumPriority"] }, then: "High" },
                { case: { $gte: ["$mediumPriority", "$lowPriority"] }, then: "Medium" }
              ],
              default: "Low"
            }
          }
        }
      },
      {
        $project: {
          maxScore: 0
        }
      }
    ];

    if (parsedLimit && parsedLimit > 0) pipeline.push({ $limit: parsedLimit });
    // if (skip && skip > 0) pipeline.push({ $skip: skip });

    const leaderboard = await Task.aggregate(pipeline);

    const last30DaysOverall = await getOverallData(currentStartDate, currentEndDate, departmentId);

    const response = leaderboard.map(stat => ({
      ...stat,
      fullName: `${stat.firstName} ${stat.lastName}`,
      performance: stat.assignedTasks ? `${((stat.completedTasks / stat.assignedTasks) * 100).toFixed(1)}` : 0,
      interval,
      last30DaysOverall,
    }))

    return response;
  } catch (error) {
    throw error;
  }
}
