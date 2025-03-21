import mongoose from "mongoose";

const StationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a station name"],
  },
  address: {
    type: String,
    required: [true, "Please provide an address"],
  },
  city: {
    type: String,
    required: [true, "Please provide a city"],
  },
  state: {
    type: String,
    required: [true, "Please provide a state"],
  },
  zip_code: {
    type: String,
    required: [true, "Please provide a zip code"],
  },
  phone: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["active", "inactive", "maintenance"],
    default: "active",
  },
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Station =
  mongoose.models.Station || mongoose.model("Station", StationSchema);

export default Station;
