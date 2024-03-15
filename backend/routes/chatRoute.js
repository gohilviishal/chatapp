const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
} = require("../controllers/chatController");

const chatRoute = express.Router();

chatRoute.post("/", protect, accessChat);
chatRoute.get("/", protect, fetchChats);
chatRoute.post("/group", protect, createGroupChat);
chatRoute.put("/rename", protect, renameGroup);
chatRoute.put("/remove", protect, removeFromGroup);
chatRoute.put("/add", protect, addToGroup);

module.exports = chatRoute;
