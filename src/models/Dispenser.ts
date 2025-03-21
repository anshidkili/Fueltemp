import mongoose from "mongoose";

const DispenserSchema = new mongoose.Schema({
  station_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Station",
    required: true,
  },
  dispenser_number: {
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
    enum: ["operational", "maintenance", "offline"],
    default: "operational",
  },
  current_meter_reading: {
    type: Number,
    default: 0,
  },
  manufacturer: {
    type: String,
    default: "",
  },
  installation_date: {
    type: Date,
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Dispenser =
  mongoose.models.Dispenser || mongoose.model("Dispenser", DispenserSchema);

export default Dispenser;
