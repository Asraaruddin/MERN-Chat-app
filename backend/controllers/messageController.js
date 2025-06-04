const asyncHandler = require("express-async-handler");
const Message = require("../Models/messageModel");
const User = require("../Models/userModel");
const Chat = require("../Models/chatModel");
 

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.status(400).json({ message: "Content and chatId are required" });
  }

  var newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message,{
       path: "chat.users",
        select: "name pic email" ,
    });

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message._id,
    });

    res.status(201).json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: error.message });
  }
});

const allMessage = asyncHandler(async (req,res)=>{

    try{
 const message = await Message.find({chat:req.params.chatId}).populate(
    "sender",
    "name pic email"
 ).populate("chat");

 res.json(message);}
    catch (error) { 
        res.status(400);
    throw new Error(error.message);

    }

})

module.exports = {sendMessage,allMessage}