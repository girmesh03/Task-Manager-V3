import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 15,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: [15, "Last name cannot be more than 15 characters"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [50, "Email cannot be more than 50 characters"],
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: [5, "Password must be at least 5 characters"],
      maxlength: [30, "Password cannot be more than 30 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    position: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "Chief Engineer",
        "Assistant Chief Engineer",
        "Electrician",
        "HVAC Technician",
        "Plumber",
        "Painter",
        "General Mechanic",
        "Wood Work Technician",
        "Civil Work Technician",
        "Lift Attendant",
      ],
    },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpiry: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpiry: { type: Date },
  },
  { timestamps: true }
);

// Middleware to capitalize first letter of first name and last name
userSchema.pre("save", function (next) {
  if (this.isModified("firstName") || this.isNew) {
    this.firstName =
      this.firstName.charAt(0).toUpperCase() + this.firstName.slice(1);
  }

  if (this.isModified("lastName") || this.isNew) {
    this.lastName =
      this.lastName.charAt(0).toUpperCase() + this.lastName.slice(1);
  }
  next();
});

// Middleware to hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
