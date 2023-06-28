const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  console.log("data");

  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId;
  const data = await invModel.getInventoryByInvId(inv_id);
  const details = await utilities.buildDetailsViewHtml(data);
  let nav = await utilities.getNav();
  const make_model = data[0].inv_make + " " + data[0].inv_model;
  res.render("./inventory/details", {
    title: make_model,
    nav,
    details,
  });
};

/* ****************************************
 *  Build vehicle management view
 * *************************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();

  const classificationSelect = await utilities.getClassificationOptions();

  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    dropdown: classificationSelect
  });
};

/* ****************************************
 *  Deliver Add Classification view
 * *************************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add a New Classification",
    nav,
    errors: null,
  });
};

invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body;

  const regResult = await invModel.addNewClassification(classification_name);
  const dropdown = await utilities.getClassificationOptions();

  let nav = await utilities.getNav();

  if (regResult) {
    req.flash("success", `Classification Added`);
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
      dropdown: dropdown
    });
  } else {
    req.flash("errors", "Sorry something went wrong.");
    res.status(501).render("inventory/add-classification", {
      title: "Add a New Classification",
      nav,
      errors: null,
    });
  }
};

/* ****************************************
 *  Deliver Add Inventory view
 * *************************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav();

  const dropdown = await utilities.getClassificationOptions();

  res.render("inventory/add-inventory", {
    title: "Add a New Vehicle",
    nav,
    dropdown: dropdown,
    inv_image: '/images/vehicles/no-image.png',
    inv_thumbnail: '/images/vehicles/no-image-tn.png',
    errors: null,
  });
};

invCont.addInventory = async function (req, res) {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

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
  );

  let nav = await utilities.getNav();

  // alert(req.body.classification_id);

  let dropdown = await utilities.getClassificationOptions(req.body.classification_id);

  if (regResult) {
    req.flash("success", `Inventory Item Added`);
    res.render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
      dropdown: dropdown
    });
  } else {
    req.flash("errors", "Sorry something went wrong.");
    res.status(501).render("inventory/add-inventory", {
      title: "Add a New Vehicle",
      nav,
      dropdown: dropdown,
      errors: null,
    });
  }
};

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInv = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  let itemData = await invModel.getInventoryByInvId(inv_id)
  itemData = itemData[0];
  const classificationSelect = await utilities.getClassificationOptions(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    dropdown: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
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
    })
  }
}

module.exports = invCont;
