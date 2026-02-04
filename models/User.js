console.log("LOADING REAL USER MODEL FILE");

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["customer", "admin", "staff"],
      default: "customer",
    },
    address: { type: String },
    phone: { type: String },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// FIXED pre-save hook 
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
