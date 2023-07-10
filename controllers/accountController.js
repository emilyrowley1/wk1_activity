const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const messageModel = require("../models/message-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
}

/* ****************************************
*  Deliver management view
* *************************************** */
async function buildManagement(req, res, next) {
  const unread_messages = await messageModel.getUnreadMessagesByAccountId(res.locals.accountData.account_id);

  let nav = await utilities.getNav()
  console.log("hello")
  res.render("account/management", {
    title: "Management",
    nav,
    errors: null,
    account_firstname: res.locals.accountData.account_firstname,
    account_lastname: res.locals.accountData.account_lastname,
    account_email: res.locals.accountData.account_email,
    unread_messages: unread_messages
  })
}


/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
  
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )
  
    if (regResult) {
      req.flash(
        "success",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null
      })
    } else {
      req.flash("errors", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
      })
    }
  }


  /* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("error", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
    delete accountData.account_password
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }

/* ****************************************
*  Deliver update account info view
* *************************************** */
async function buildUpdateAccountForm(req, res, next) {
  let nav = await utilities.getNav()

  res.render("account/update-user", {
    title: "Update Account",
    nav,
    errors: null,
    account_firstname: res.locals.accountData.account_firstname,
    account_lastname: res.locals.accountData.account_lastname,
    account_email: res.locals.accountData.account_email
  })
}


   /* ****************************************
 *  Log out
 * ************************************ */
async function logout(req, res) {
  res.clearCookie('jwt');
  res.locals.loggedin = 0;
  let nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})

 }

  /* ****************************************
 *  Update user info
 * ************************************ */
async function updateAccount(req, res, next) {
  let nav = await utilities.getNav()

  const {
    account_firstname,
    account_lastname,
    account_email,
  } = req.body

  const updateResult = await accountModel.updateAccountInfo(
    account_firstname,
    account_lastname,
    account_email,
    res.locals.accountData.account_id
  )

  const accountData = await accountModel.getAccountById(res.locals.accountData.account_id)
  res.clearCookie('jwt');
  const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
  res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })

  if (updateResult) {
    req.flash("success", "Your account was updated.")
    res.render("account/management", {
      title: "Management",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    })
  } else {
    req.flash("errors", "Something went wrong while updating your account.")
    res.render("account/update-user", {
      title: "Update Account",
      nav,
      errors: null,
      accountData: res.locals.accountData
    })
  }
}

  /* ****************************************
 *  Update user password
 * ************************************ */
  async function updatePassword(req, res, next) {
    let nav = await utilities.getNav()
  
    const {
      account_password,
      account_id
    } = req.body

    let hashedPassword
    try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
      req.flash("error", 'Sorry, there was an error processing the registration.')
      res.render("account/update-user", {
        title: "Update Account",
        nav,
        errors: null,
        accountData: res.locals.accountData
      })
    }

    const updateResult = await accountModel.updatePassword(
      hashedPassword,
      res.locals.accountData.account_id
    )
  
    if (updateResult) {
      req.flash("success", "Your account was updated.")
      res.render("account/management", {
        title: "Management",
        nav,
        errors: null,
        account_firstname: res.locals.accountData.account_firstname,
        account_lastname: res.locals.accountData.account_lastname,
        account_email: res.locals.accountData.account_email
      })
    } else {
      req.flash("errors", "Something went wrong while updating your account.")
      res.render("account/update-user", {
        title: "Update Account",
        nav,
        errors: null,
        accountData: res.locals.accountData
      })
    }
  }
  
module.exports = { buildLogin, buildRegister, registerAccount, buildManagement, accountLogin, logout, buildUpdateAccountForm, updateAccount, updatePassword}