import mongoose from "mongoose";

const FuelReadingSchema = new mongoose.Schema({
  fuel_type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FuelType",
    required: true,
  },
  initial_reading: {
    type: Number,
    required: true,
  },
  final_reading: {
    type: Number,
    default: null,
  },
});

const ShiftSchema = new mongoose.Schema({
  station_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Station",
    required: true,
  },
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  dispenser_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dispenser",
    required: true,
  },
  start_time: {
    type: Date,
    required: true,
  },
  end_time: {
    type: Date,
    default: null,
  },
  initial_cash: {
    type: Number,
    required: true,
  },
  final_cash: {
    type: Number,
    default: null,
  },
  fuel_readings: [FuelReadingSchema],
  notes: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["active", "completed"],
    default: "active",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Shift = mongoose.models.Shift || mongoose.model("Shift", ShiftSchema);

export default Shift;
