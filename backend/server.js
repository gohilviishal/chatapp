const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoute = require("./routes/userRoute");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const chatRoute = require("./routes/chatRoute");
const messageRoute = require("./routes/messageRoute");
const path = require("path");
require("dotenv").config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);

//----------DEPLOYMENT-------------
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running successfully");
  });
}
//----------DEPLOYMENT-------------

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log("server is listening on " + PORT);
});

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
  },
  pingTimeout: 60000,
});

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room : " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;
    if (!chat.users) {
      return console.log("chat.users not defined");
    }
    chat.users.forEach((u) => {
      if (u._id == newMessageReceived.sender._id) {
        return;
      }
      socket.in(u._id).emit("message received", newMessageReceived);
    });
  });
});
