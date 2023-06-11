const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  console.log('data');

  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryByInvId(inv_id)
  const details = await utilities.buildDetailsViewHtml(data)
  let nav = await utilities.getNav()
  const make_model = data[0].inv_make + " " + data[0].inv_model
  res.render("./inventory/details", {
    title: make_model,
    nav,
    details,
  })
}

invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver Add Classification view
* *************************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add a New Classification",
    nav,
    errors: null,
  })
}

invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body

  const regResult = await invModel.addNewClassification(
    classification_name
  )

  let nav = await utilities.getNav()

  if (regResult) {
    req.flash(
      "success",
      `Classification Added`
    )
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null
    })
  } else {
    req.flash("errors", "Sorry something went wrong.")
    res.status(501).render("inventory/add-classification", {
      title: "Add a New Classification",
      nav,
      errors: null,
    })
  }
}


/* ****************************************
*  Deliver Add Inventory view
* *************************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()

  const dropdown = await utilities.getClassificationsDropDown();

  res.render("inventory/add-inventory", {
    title: "Add a New Vehicle",
    nav,
    dropdown: dropdown,
    errors: null,
  })
}

invCont.addInventory = async function (req, res) {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  
  const regResult = await invModel.addNewInventory(
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color, 
    classification_id
  )

  let nav = await utilities.getNav()
  let dropdown = await utilities.getClassificationsDropDown()


  if (regResult) {
    req.flash(
      "success",
      `Inventory Item Added`
    )
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null
    })
  } else {
    req.flash("errors", "Sorry something went wrong.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add a New Vehicle",
      nav,
      dropdown: dropdown,
      errors: null,
    })
  }
}

module.exports = invCont