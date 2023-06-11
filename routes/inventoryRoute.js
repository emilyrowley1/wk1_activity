// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require('../utilities')
const invValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("", utilities.handleErrors(invController.buildManagement));
router.get("/classification", utilities.handleErrors(invController.buildAddClassification));
// Add the new classification
router.post(
    "/classification",
    invValidate.addClassificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
)

router.get("/addInventory", utilities.handleErrors(invController.buildAddInventory));
// Add the new classification
router.post(
    "/addInventory",
    invValidate.inventoryRules(),
    invValidate.checkInvData,
    utilities.handleErrors(invController.addInventory)
)

router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));

module.exports = router;