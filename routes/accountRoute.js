// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountsController = require("../controllers/accountController")
const utilities = require('../utilities')
const regValidate = require('../utilities/account-validation')

router.get("/", utilities.checkLogin, utilities.handleErrors(accountsController.buildManagement))

// Route to build inventory by classification view
router.get("/login", utilities.handleErrors(accountsController.buildLogin));
router.get("/register", utilities.handleErrors(accountsController.buildRegister));

// route to log out
router.get("/logout", utilities.handleErrors(accountsController.logout));

// Update user information
router.get("/update/:account_id", utilities.handleErrors(accountsController.buildUpdateAccountForm));
router.post(
  "/update/:account_id", 
  regValidate.updateAccountRules(),
  regValidate.checkAccountUpdateData,
  utilities.handleErrors(accountsController.updateAccount)
);

router.post(
    "/updatePassword/:account_id", 
    regValidate.newPasswordRules(),
    regValidate.checkAccountUpdateData,
    utilities.handleErrors(accountsController.updatePassword));


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
    utilities.handleErrors(accountsController.accountLogin),
    // (req, res) => {
    //   res.status(200).send('login process')
    // }
  )


module.exports = router;