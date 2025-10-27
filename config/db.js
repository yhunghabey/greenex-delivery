/* eslint-disable no-console */
const mongoose = require("mongoose");

const db =
  "mongodb+srv://yhunghabey1994_db_user:AnJv8wFGUmBkE1jV@cluster0.ledellx.mongodb.net/";

const connectDB = async () => {
  try {
    await mongoose.set("strictQuery", false); // Set it to true or false as needed
    await mongoose.connect(db, {
      //useNewUrlParser: true,
      //useUnifiedTopology: true,
    });

    console.log("MongoDB Connected....");
  } catch (err) {
    console.log(`MongoDB connection failed due to: ${err.message}`);
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
