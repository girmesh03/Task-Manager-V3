import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "Department is required"],
    },
    title: {
      type: String,
      required: [true, "Task title is required"],
    },
    description: {
      type: String,
      required: [true, "Task description is required"],
    },
    status: {
      type: String,
      enum: ["Completed", "In Progress", "Pending", "To Do"],
      default: "To Do",
    },
    date: {
      type: Date,
      default: Date.now, // Use Date.now without invoking it immediately
    },
    location: {
      type: String,
      required: [true, "Task location is required"],
    },
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Assigned user is required"],
      },
    ],
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Low",
    },
    category: {
      type: [
        {
          type: String,
          enum: [
            "Electrical",
            "HVAC",
            "Plumbing",
            "Painting",
            "Mechanical",
            "Wood-Working",
            "Civil",
            "Other",
          ],
        },
      ],
      default: ["Other"], // Default includes "Other"
    },
    activities: [
      {
        action: {
          type: String,
          required: [true, "Activity action is required"],
        },
        performedBy: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Performed user is required"],
          },
        ],
        timestamp: {
          type: Date,
          default: Date.now,
        },
        notes: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

TaskSchema.pre("save", function (next) {
  // Capitalize title
  if (this.isModified("title") || this.isNew) {
    this.title = this.title.charAt(0).toUpperCase() + this.title.slice(1);
  }

  // Capitalize location
  if (this.isModified("location") || this.isNew) {
    this.location =
      this.location.charAt(0).toUpperCase() + this.location.slice(1);
  }

  // Iterate through the activities array and capitalize the action field of each activity
  if (this.activities && this.activities.length > 0) {
    this.activities.forEach((activity) => {
      if (activity.action) {
        activity.action =
          activity.action.charAt(0).toUpperCase() + activity.action.slice(1);
      }
    });
  }
  next();
});

const Task = mongoose.model("Task", TaskSchema);

export default Task;
