// ------------------------ Imports ------------------------
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// ------------------------ Config ------------------------
dotenv.config();
connectDB();

const app = express();
app.use(express.json()); // To accept JSON data

// --- CORS Middleware ---
app.use(
  cors({
    origin: ["http://localhost:3000", "https://talkify-5m26.onrender.com"],
    credentials: true,
  })
);

// ------------------------ Routes ------------------------
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// ------------------------ Deployment ------------------------
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is Running Successfully");
  });
}

// ------------------------ Error Handling ------------------------
app.use(notFound);
app.use(errorHandler);

// ------------------------ Server Listen ------------------------
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`Server started on port ${PORT}`)
);

// ------------------------ Socket.io ------------------------
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: ["http://localhost:3000", "https://talkify-5m26.onrender.com"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.userData = userData; // store user data on socket
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room: " + room);
  });

  socket.on("typing", ({ roomId, userId }) => {
    socket.in(roomId).emit("typing", { userId });
  });

  socket.on("stop typing", ({ roomId, userId }) => {
    socket.in(roomId).emit("stop typing", { userId });
  });

  socket.on("new message", (newMessageReceived) => {
    const chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((u) => {
      if (u._id === newMessageReceived.sender._id) return;
      socket.in(u._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    if (socket.userData?._id) {
      socket.leave(socket.userData._id);
    }
  });
});
