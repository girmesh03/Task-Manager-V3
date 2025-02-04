import Task from "../models/TaskModel.js";
import User from "../models/UserModel.js";

const generateTasks = async () => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    if (users?.length < 2 || !users || users?.length > 17) {
      throw new Error("Not enough users to generate tasks");
    }

    const userIds = users.map((user) => user._id);

    // Helper function to generate a random date within 6 months
    const generateRandomDate = (startDate, endDate) => {
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      return new Date(start + Math.random() * (end - start)).toISOString();
    };

    const monthRange = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(new Date());
      date.setMonth(date.getMonth() - i);
      return date.toISOString().split("T")[0];
    });

    // console.log("monthRange: ", monthRange[0], monthRange[monthRange.length - 1]);

    const taskCategories = [
      "Electrical",
      "HVAC",
      "Plumbing",
      "Painting",
      "Mechanical",
      "Wood-Working",
      "Civil",
      "Other",
    ];
    const locations = [
      "Main Lobby",
      "Cold Storage",
      "Boiler Room",
      "Guest Rooms",
      "Main Kitchen",
      "Staff Restroom",
      "Facility",
    ];
    const priorities = ["High", "Medium", "Low"];
    const statuses = ["In Progress", "Pending", "Completed", "To Do"];

    const tasks = Array.from({ length: 10 }).map((_, index) => {
      const randomUsers = userIds.sort(() => 0.5 - Math.random()).slice(0, 2); // Randomly select up to 2 users
      const date = generateRandomDate(monthRange[monthRange.length - 1], monthRange[0]); // Generate random date between 6 months ago and now
      const category = taskCategories.sort(() => 0.5 - Math.random()).slice(0, 2); // Pick up to 2 categories
      const location = locations[Math.floor(Math.random() * locations.length)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      return {
        title: `Task ${index + 1}`,
        description: `Description for Task ${index + 1}`,
        status,
        date,
        location,
        assignedTo: randomUsers,
        priority,
        activities: [
          {
            action: "Created task",
            performedBy: randomUsers[0],
            timestamp: date,
            notes: `Task ${index + 1} created.`,
          },
        ],
        category,
      };
    });

    const insertedTasks = await Task.insertMany(tasks);
    console.log(`${insertedTasks.length} tasks generated successfully!`);
    return insertedTasks;
  } catch (error) {
    console.error("Error generating tasks:", error.message);
  }
};


// Insert tasks into the database
const insertManyTasks = async () => {
  try {
    const result = await generateTasks();
    console.log(`${result.length} tasks inserted successfully!`);
  } catch (error) {
    console.error("Error inserting tasks:", error.message);
  }
};

// Delete all tasks from the database
const deleteAllTasks = async () => {
  try {
    const result = await Task.deleteMany({});
    console.log(`${result.deletedCount} tasks deleted successfully!`);
  } catch (error) {
    console.error("Error deleting tasks:", error.message);
  }
};

export { insertManyTasks, deleteAllTasks };
