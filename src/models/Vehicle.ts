import mongoose from "mongoose";

const VehicleSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  license_plate: {
    type: String,
    required: true,
  },
  make: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  fuel_type_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FuelType",
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Vehicle =
  mongoose.models.Vehicle || mongoose.model("Vehicle", VehicleSchema);

export default Vehicle;
