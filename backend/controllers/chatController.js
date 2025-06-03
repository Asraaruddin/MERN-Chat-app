const asyncHandler = require("express-async-handler");
const Chat = require("../Models/chatModel");
const User = require("../Models/userModel");

// @desc    Access or create one-to-one chat
// @route   POST /api/chat/
// @access  Protected
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

// @desc    Fetch all chats for a user
// @route   GET /api/chat/
// @access  Protected
const fetchChats = asyncHandler(async (req, res) => {
  try {
    let results = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    results = await User.populate(results, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    res.status(200).send(results);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// @desc    Create new group chat
// @route   POST /api/chat/group
// @access  Protected

const createGroupChat = asyncHandler(async (req, res) => {
   console.log("Incoming request body:", req.body); 
   console.log("Logged in user (req.user):", req.user);
// ✅ moved here
  let { users, name } = req.body;
  
  // Validate required fields
  if (!users || !name) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }

  // Parse if users is a string (e.g., from Postman raw input)
  if (typeof users === "string") {
    try {
      users = JSON.parse(users);
    } catch (e) {
      return res.status(400).send({ message: "Invalid users format" });
    }
  }

  // Add current user (group creator)
  const currentUserId = req.user._id.toString();
  users = users.map((u) => u.toString());
  if (!users.includes(currentUserId)) {
    users.push(currentUserId);
  }

  // Ensure at least 3 unique users (including the creator)
  const uniqueUsers = [...new Set(users)];

  console.log("Current user ID:", currentUserId);
console.log("Users array:", users);
console.log("Unique users:", uniqueUsers);
console.log("Unique users count:", uniqueUsers.length);

  if (uniqueUsers.length < 3) {
    return res.status(400).send("More than 2 unique users are required to form a group chat");
  }

  try {
    const groupChat = await Chat.create({
      chatName: name,
      users: uniqueUsers,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
    
  }

});



// @desc    Rename group
// @route   PUT /api/chat/rename
// @access  Protected
const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat not found");
  }

  res.json(updatedChat);
});


// @desc    Add user to group
// @route   PUT /api/chat/groupadd
// @access  Protected
const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat not found");
  }

  res.json(added);
});


// @desc    Remove user from group
// @route   PUT /api/chat/groupremove
// @access  Protected
const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat not found");
  }

  res.json(removed);
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
