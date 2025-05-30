const mongoose = require("mongoose");

const messageModel = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true }, // ✅ FIXED: it's a string, not ObjectId
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" }, // ✅ ADD this field
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageModel);

module.exports = Message;
