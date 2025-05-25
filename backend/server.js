const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");        // require cors at top
const { chats } = require("./data/data");

const app = express();
dotenv.config();

app.use(cors());                     // use cors BEFORE routes

app.get("/", (req, res) => {
  res.send("API is running successfully ");
});

app.get("/api/chat", (req, res) => {
  res.send(chats);
});

app.get("/api/chat/:id", (req, res) => {
  const singleChat = chats.find((c) => c._id === req.params.id);
  res.send(singleChat);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on Port ${PORT}`));
