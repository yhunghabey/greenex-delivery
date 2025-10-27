const mongoose = require("mongoose");
//const { USERTYPE, ACCOUNT_STATUS } = require('../../utils/constant');
const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  userID: {
    type: String,
  },
  username: {
    type: String,
  },

  password: {
    type: String,
    minlength: 6,
    select: false,
  },

  email: {
    type: String,
    //required: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
    //unique: [true, "User with email already exists"],
  },
  phoneNumber: {
    type: String,
    unique: [true, "User with phone number already exists"],
  },
  token: {
    type: String,
  },
  status: {
    type: String,
    enum: ["ACTIVE", "INACTIVE"],
    default: "INACTIVE",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  deleted: {
    type: Boolean,
    default: false,
    select: false,
  },
});

const User = mongoose.model("user", userSchema);

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
userSchema.methods.getSignedJwtToken = async function () {
  try {
    const user = this;
    const token = Jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    user.token = token;
    await user.save();
    return user;
  } catch (err) {
    return console.log(err);
  }
};
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

async function comparePassword(plainText, hash) {
  try {
    return await bcrypt.compare(plainText, hash);
  } catch (err) {
    throw err;
  }
}

module.exports = {
  comparePassword,
  User,
};
