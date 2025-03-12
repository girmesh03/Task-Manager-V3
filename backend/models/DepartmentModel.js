import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Department name is required"],
      trim: true,
      maxlength: [30, "Department name cannot be more than 30 characters"],
      unique: [true, "Department name must be unique"],
    },
  }, {
  timestamps: true,
});

DepartmentSchema.pre("save", function (next) {
  if (this.isModified("name") || this.isNew) {
    this.name =
      this.name.charAt(0).toUpperCase() + this.name.slice(1);
  }
  next();
});

const Department = mongoose.model("Department", DepartmentSchema);

export default Department;
