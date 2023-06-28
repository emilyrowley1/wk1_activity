// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require('../utilities')
const invValidate = require('../utilities/inventory-validation')

// routes that everyone can get to
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))


// Route to build inventory by classification view
router.get("",  utilities.checkAccountType, utilities.handleErrors(invController.buildManagement));
router.get("/classification", utilities.checkAccountType, utilities.handleErrors(invController.buildAddClassification));
// Add the new classification
router.post(
    "/classification",
    utilities.checkAccountType,
    invValidate.addClassificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
)

// Add the new inventory
router.get("/addInventory", utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventory));
router.post(
    "/addInventory",
    invValidate.inventoryRules(),
    invValidate.checkInvData,
    utilities.checkAccountType,
    utilities.handleErrors(invController.addInventory)
)

// routes to update inventory items
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInv))
router.post(
    "/update", 
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.checkAccountType,
    utilities.handleErrors(invController.updateInventory)
)




module.exports = router;