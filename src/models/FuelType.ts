import mongoose from "mongoose";

const FuelTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  price_per_liter: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const FuelType =
  mongoose.models.FuelType || mongoose.model("FuelType", FuelTypeSchema);

export default FuelType;
