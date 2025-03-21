import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
  },
  full_name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  role: {
    type: String,
    enum: ["superadmin", "admin", "employee", "customer"],
    default: "customer",
  },
  avatar_url: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
UserSchema.pre("save", async function () {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Fix for browser environment - check if mongoose.models exists
let User;
try {
  User = mongoose.models.User || mongoose.model("User", UserSchema);
} catch (error) {
  User = mongoose.model("User", UserSchema);
}

export default User;
