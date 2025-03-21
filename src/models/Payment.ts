import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  invoice_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Invoice",
    default: null,
  },
  amount: {
    type: Number,
    required: true,
  },
  payment_date: {
    type: Date,
    required: true,
  },
  payment_method: {
    type: String,
    enum: ["cash", "bank_transfer", "credit_card", "check"],
    required: true,
  },
  reference_number: {
    type: String,
    default: "",
  },
  notes: {
    type: String,
    default: "",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Payment =
  mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);

export default Payment;
