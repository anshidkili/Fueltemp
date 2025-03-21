import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  station_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Station",
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  hire_date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "on_leave"],
    default: "active",
  },
  hourly_rate: {
    type: Number,
    required: true,
  },
  salary: {
    type: Number,
    default: 0,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Employee =
  mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema);

export default Employee;
