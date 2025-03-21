import mongoose from "mongoose";

const SaleSchema = new mongoose.Schema({
  station_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Station",
    required: true,
  },
  dispenser_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dispenser",
    required: true,
  },
  fuel_type_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FuelType",
    required: true,
  },
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    default: null,
  },
  vehicle_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    default: null,
  },
  quantity_liters: {
    type: Number,
    required: true,
  },
  price_per_liter: {
    type: Number,
    required: true,
  },
  total_amount: {
    type: Number,
    required: true,
  },
  payment_method: {
    type: String,
    enum: ["cash", "credit_card", "debit_card", "credit_account"],
    required: true,
  },
  transaction_date: {
    type: Date,
    default: Date.now,
  },
  invoice_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Invoice",
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Sale = mongoose.models.Sale || mongoose.model("Sale", SaleSchema);

export default Sale;
