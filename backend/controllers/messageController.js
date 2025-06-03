const asyncHandler = require("express-async-handler");
const Message = require("../Models/messageModel");
const User = require("../Models/userModel");
const Chat = require("../Models/chatModel");

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    // ✅ STORE the result in a variable
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { latestMessage: message._id },
      { new: true } // returns updated document
    );
    res.json(message);
  } catch (error) {
    console.error("SendMessage Error:", error); // Add this for debugging
    res.status(400);
    throw new Error(error.message);
  }
});


const allMessage = asyncHandler(async (req,res)=>{

    try{
 const message = await Message.find({chat:req.params.chatId}).populate(
    "sender",
    "name pic email"
 ).populate("chat");
  console.log("Updated chat latestMessage:", updatedChat.latestMessage);

 res.json(message);}
    catch (error) { 
        res.status(400);
    throw new Error(error.message);

    }

})

module.exports = {sendMessage,allMessage}