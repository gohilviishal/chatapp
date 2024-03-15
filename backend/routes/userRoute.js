const express = require("express");
const { signup, login, allUsers } = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

const userRoute = express.Router();

userRoute.post("/login", login);
userRoute.post("/signup", signup);
userRoute.get("/", protect, allUsers);

module.exports = userRoute;
