const express = require("express");
const { protect } = require("../middleware/AuthMiddleWare");
const {accessChat} = require("../controllers/chatController")
const router =  express.Router();

router.route("/").post(protect,accessChat);
router.route("/").get(protect,fetchChats);
router.route("/group").get(protect,createGroupChat);
router.route("/rename").put(protect,renameGroup);
router.route("/groupradd").put(protect,addToGroup);
router.route("/groupremove").put(protect,renameGroup);


module.exports = router;