const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {};

/*  **********************************
 *  Send Message Data Validation Rules
 * ********************************* */
validate.sendMessageRules = () => {
    return [
      // valid email is required and cannot already exist in the DB
      body("message_to")
      .isLength({ min: 1 })
      .trim()
      .withMessage("There must be someone to send it to"),
  
      // message subject required
      body("message_subject")
        .trim()
        .isLength({ min: 1 })
        .withMessage("There must be a subject"),

      //    // message body required
      body("message_body")
      .trim()
      .isLength({ min: 1 })
      .withMessage("There must be a message body"),
    ]
}

/* ******************************
* Check data and return errors or continue to login
* ***************************** */
validate.checkSendMessageData = async (req, res, next) => {
    const { message_to, message_subject, message_body } = req.body
    const message_to_dropdown = await utilities.buildUserDropdown(message_to)

    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("message/newMessage", {
        errors,
        title: "Create a New Message",
        nav,
        message_to: message_to_dropdown,
        message_subject,
        message_body
      })
      return
    }
    next()
}

module.exports = validate;