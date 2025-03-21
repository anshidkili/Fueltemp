import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  company_name: {
    type: String,
    required: true,
  },
  credit_limit: {
    type: Number,
    required: true,
  },
  current_balance: {
    type: Number,
    default: 0,
  },
  payment_terms: {
    type: String,
    default: "Net 30",
  },
  status: {
    type: String,
    enum: ["active", "inactive", "suspended"],
    default: "active",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Customer =
  mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);

export default Customer;
