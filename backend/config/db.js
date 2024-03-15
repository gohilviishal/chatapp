const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};

module.exports = connectDB;
