const messageModel = require("../models/message-model");
const utilities = require("../utilities/");

const messageCont = {};

/* ***************************
 *  Build inbox view
 * ************************** */
messageCont.buildInbox = async function (req, res, next) {
  const data = await messageModel.getInboxMessagesByAccountId(res.locals.accountData.account_id);

  const messageTable = await utilities.buildMessageTable(data);
  let nav = await utilities.getNav();

  const a = await messageModel.getArchivedMessagesByAccountId(res.locals.accountData.account_id);
  const archived = a.length;
//   const className = data[0].classification_name;
  res.render("./message/inbox", {
    title: res.locals.accountData.account_firstname + " " + res.locals.accountData.account_lastname + " Inbox",
    nav,
    messageTable: messageTable,
    archived
  });
};

messageCont.buildMessageView = async function (req, res, next) {
  const message_id = req.params.message_id;
  const data = await messageModel.getMessageDetailsById(message_id);
  const details = await utilities.buildMessageDetailsViewHtml(data);
  let nav = await utilities.getNav();
  const message_subject = data[0].message_subject;
  res.render("./message/details", {
    title: message_subject,
    nav,
    details: details,
  });
};

/* ***************************
 *  Archive Message
 * ************************** */
messageCont.archiveMessage = async function (req, res, next) {
    const message_id = req.params.message_id;

    const archived = await messageModel.archiveMessageById(message_id);

    if (archived){
        req.flash("success", "Your message was archived.")
        res.redirect("/message")
    }
    else {
        req.flash("errors", "The message failed to archive.")
        res.redirect("/message")
    }
};

/* ***************************
 *  Mark Message As Read
 * ************************** */
messageCont.markAsRead = async function (req, res, next) {
    const message_id = req.params.message_id;

    const read =  await messageModel.markAsReadById(message_id);

    if (read){
        req.flash("success", "Your message was marked as read.")
        res.redirect("/message")
    }
    else {
        req.flash("errors", "The message failed to mark as read.")
        res.redirect("/message")
    }
};

/* ***************************
 *  Delete Message
 * ************************** */
messageCont.deleteMessage = async function (req, res, next) {
  const message_id = req.params.message_id;

  const read =  await messageModel.deleteMessageById(message_id);

  if (read){
      req.flash("success", "Your message was deleted.")
      res.redirect("/message")
  }
  else {
      req.flash("errors", "The message failed to delete.")
      res.redirect("/message")
  }
};

/* ***************************
 *  Build new Message view
 * ************************** */
messageCont.buildNewMessage = async function (req, res, next) {

  const message_to = await utilities.buildUserDropdown()

  let nav = await utilities.getNav();
  res.render("./message/newMessage", {
    title: "Create A New Message",
    nav,
    message_to: message_to
  });
};


/* ***************************
 *  Send the message
 * ************************** */
messageCont.sendMessage = async function (req, res) {
  const message_created = new Date();

  const {
    message_subject,
    message_body,
    message_to,
  } = req.body;

  const regResult = await messageModel.addNewMessage(message_subject, message_body, message_created, Number(message_to), res.locals.accountData.account_id);

  let nav = await utilities.getNav();
  let users = await utilities.buildUserDropdown(req.body.message_to);
  const data = await messageModel.getInboxMessagesByAccountId(res.locals.accountData.account_id);
  const messageTable = await utilities.buildMessageTable(data);

  if (regResult) {
    req.flash("success", `Message Sent`);
    res.render("./message/inbox", {
      title: res.locals.accountData.account_firstname + " " + res.locals.accountData.account_lastname + " Inbox",
      nav,
      messageTable: messageTable,
      archived: 1,
      errors: null
    });
  } else {
    req.flash("errors", "Sorry something went wrong.");
    res.status(501).render("message/new", {
      title: "Create a New Message",
      nav,
      message_to: users,
      errors: null,
    });
  }
};

/* ***************************
 *  Build archive view
 * ************************** */
messageCont.buildArchive = async function (req, res, next) {
  const data = await messageModel.getArchivedMessagesByAccountId(res.locals.accountData.account_id);

  const messageTable = await utilities.buildMessageTable(data);
  let nav = await utilities.getNav();
//   const className = data[0].classification_name;
  res.render("./message/archive", {
    title: res.locals.accountData.account_firstname + " " + res.locals.accountData.account_lastname + " Archived Messages",
    nav,
    messageTable: messageTable,
  });
};

/* ***************************
 *  Build new Message view
 * ************************** */
messageCont.buildReply = async function (req, res, next) {
  const message_id = req.params.message_id;
  const data = await messageModel.getMessageDetailsById(message_id);
  const name = await messageModel.getName(data[0].message_from);
  const message_to = await utilities.buildUserDropdown(data[0].message_from)

  let nav = await utilities.getNav();
  res.render("./message/newMessage", {
    title: "Reply to " + name.account_firstname + " " + name.account_lastname,
    nav,
    message_to: message_to,
    message_subject: "RE: " + data[0].message_subject,
    message_body: "\n\n\n-------------------------------------\n" + data[0].message_body
  });
};

module.exports = messageCont;