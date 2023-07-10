// Needed Resources 
const express = require("express")
const router = new express.Router() 
const messageController = require("../controllers/messageController")
const utilities = require('../utilities')
const messageValidate = require('../utilities/message-validation')

// routes that everyone can get to
router.get("/archive", utilities.handleErrors(messageController.buildArchive));
router.get("/archive/:message_id", utilities.handleErrors(messageController.archiveMessage))
router.get("/markRead/:message_id", utilities.handleErrors(messageController.markAsRead))
router.get("/delete/:message_id", utilities.handleErrors(messageController.deleteMessage))
router.get("/reply/:message_id", utilities.handleErrors(messageController.buildReply))

router.get("/new", utilities.handleErrors(messageController.buildNewMessage))
router.post("/new", 
    messageValidate.sendMessageRules(), 
    messageValidate.checkSendMessageData, 
    utilities.handleErrors(messageController.sendMessage
))

router.get("/:message_id", utilities.handleErrors(messageController.buildMessageView));

router.get("/", utilities.handleErrors(messageController.buildInbox));


// // Route to build message by classification view
// router.get("",  utilities.checkAccountType, utilities.handleErrors(messageController.buildManagement));
// router.get("/classification", utilities.checkAccountType, utilities.handleErrors(messageController.buildAddClassification));
// // Add the new classification
// router.post(
//     "/classification",
//     utilities.checkAccountType,
//     messageValidate.addClassificationRules(),
//     messageValidate.checkClassificationData,
//     utilities.handleErrors(messageController.addClassification)
// )

// // Add the new message
// router.get("/addmessage", utilities.checkAccountType, utilities.handleErrors(messageController.buildAddmessage));
// router.post(
//     "/addmessage",
//     messageValidate.messageRules(),
//     messageValidate.checkmessageData,
//     utilities.checkAccountType,
//     utilities.handleErrors(messageController.addmessage)
// )

// // routes to update message items
// router.get("/edit/:message_id", utilities.handleErrors(messageController.editmessage))
// router.post(
//     "/update", 
//     messageValidate.messageRules(),
//     messageValidate.checkUpdateData,
//     utilities.checkAccountType,
//     utilities.handleErrors(messageController.updatemessage)
// )




module.exports = router;