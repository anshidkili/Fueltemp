import mongoose from "mongoose";

const InvoiceItemSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unit_price: {
    type: Number,
    required: true,
  },
  total_price: {
    type: Number,
    required: true,
  },
  sale_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sale",
    default: null,
  },
});

const InvoiceSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  invoice_number: {
    type: String,
    required: true,
    unique: true,
  },
  issue_date: {
    type: Date,
    required: true,
  },
  due_date: {
    type: Date,
    required: true,
  },
  total_amount: {
    type: Number,
    required: true,
  },
  paid_amount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["pending", "partial", "paid", "overdue"],
    default: "pending",
  },
  notes: {
    type: String,
    default: "",
  },
  items: [InvoiceItemSchema],
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Invoice =
  mongoose.models.Invoice || mongoose.model("Invoice", InvoiceSchema);

export default Invoice;
