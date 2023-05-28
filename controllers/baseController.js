const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}

baseController.error = async function (req, res, next) {
  const string_error = "some string"
  string_error = "I'm making an error here";
  let nav = await utilities.getNav()
  res.render("./errors/error", {
    title: 'bad Error',
    message,
    nav
  })
}

module.exports = baseController