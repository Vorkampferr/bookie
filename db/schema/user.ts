import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  tgId: {
    type: String,
    unique: true,
    trim: true,
  },
  state: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
