const express =  require('express');
const { protect } = require('../middleware/AuthMiddleWare');
const {sendMessage} = require("../controllers/messageController")
const {allMessage} =  require("../controllers/messageController")

const router = express.Router();

router.route('/').post(protect,sendMessage)
router.route('/:chatId').get(protect,allMessage)
 module.exports = router;
