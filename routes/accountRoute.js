// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountsController = require("../controllers/accountController")
const utilities = require('../utilities')
const regValidate = require('../utilities/account-validation')

// Route to build inventory by classification view
router.get("/login", utilities.handleErrors(accountsController.buildLogin));
router.get("/register", utilities.handleErrors(accountsController.buildRegister));

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountsController.registerAccount)
)

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountsController.processLogin),
    // (req, res) => {
    //   res.status(200).send('login process')
    // }
  )


module.exports = router;