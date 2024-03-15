const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { sendMessage, getAllMessages } = require("../controllers/messageController");

const messageRoute = express.Router();

messageRoute.post("/", protect, sendMessage);
messageRoute.get("/:chatId", protect, getAllMessages);

module.exports = messageRoute;
