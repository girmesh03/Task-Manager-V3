import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Completed", "In Progress", "Pending", "To Do"],
      default: "To Do",
    },
    date: {
      type: Date,
      default: Date.now(),
    },
    location: {
      type: String,
      required: true,
    },
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
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
          required: true,
        },
        performedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
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

const Task = mongoose.model("Task", TaskSchema);

export default Task;
