import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
  station_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Station",
    required: true,
  },
  fuel_type_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FuelType",
    required: true,
  },
  quantity_liters: {
    type: Number,
    required: true,
  },
  last_updated: {
    type: Date,
    default: Date.now,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Inventory =
  mongoose.models.Inventory || mongoose.model("Inventory", InventorySchema);

export default Inventory;
