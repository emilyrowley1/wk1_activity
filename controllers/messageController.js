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
//   const className = data[0].classification_name;
  res.render("./message/inbox", {
    title: res.locals.accountData.account_firstname + " " + res.locals.accountData.account_lastname + " Inbox",
    nav,
    messageTable: messageTable,
    archived: 1
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
    let nav = await utilities.getNav();

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
    let nav = await utilities.getNav();

    const read =  false;//await messageModel.markAsReadById(message_id);

    if (read){
        req.flash("success", "Your message was marked as read.")
        res.redirect("/message")
    }
    else {
        req.flash("errors", "The message failed to mark as read.")
        res.redirect("/message")
    }
};

module.exports = messageCont;