const utilities = require(".");
const invModel = require("../models/inventory-model");
const { body, validationResult } = require("express-validator");
const validate = {};

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.addClassificationRules = () => {
  return [
    // firstname is required and must be string
    body("classification_name")
      .isLength({ min: 1 })
      .withMessage("Please provide a valid name.")
      .custom(async (value) => {
        const letters = /^[a-zA-Z]+$/;
        if (!value.match(letters)) {
          throw new Error("Only letters are allowed");
        }
      }),
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      errors,
      title: "Add a New Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    // make is required and must be string
    body("inv_make")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a vehicle make."), // on error this message is sent.

    // model is required and must be string
    body("inv_model")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a vehicle model."), // on error this message is sent.

    // valid year is required
    body("inv_year")
      .trim()
      // .withMessage("A valid year is required.")
      .custom(async (value) => {
        const numbers = /^\d{4}$/;
        if (!value.match(numbers)) {
          throw new Error("Only a year is excepted.");
        }
      }),

    // description is required and must be string
    body("inv_description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a vehicle description."), // on error this message is sent.

    // image is required and must be string
    body("inv_image")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a vehicle image path."), // on error this message is sent.

    // thumbnail is required and must be string
    body("inv_thumbnail")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a vehicle thumbnail."), // on error this message is sent.

    // price is required and must be string
    body("inv_price")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a vehicle price."), // on error this message is sent.

    // firstname is required and must be string
    body("inv_miles").isNumeric().withMessage("Please provide vehicle miles."),

    // lastname is required and must be string
    body("inv_color")
      .trim()
      .escape()
      .isAlpha()
      .withMessage("Please provide a vehicle color."), // on error this message is sent.

    // lastname is required and must be string
    body("classification_id")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification."), // on error this message is sent.
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkInvData = async (req, res, next) => {
  
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
  
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {    
    let nav = await utilities.getNav();
    let dropdown = await utilities.getClassificationOptions(classification_id);
    res.render("inventory/add-inventory", {
      errors,
      title: "Add a New Vehicle",
      nav,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      dropdown,
    });
    return;
  }
  next();
};

/* ******************************
 * Check data and direct errors back to edit view
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  
  const {
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
    classification_id,
  } = req.body;
  
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {    
    let nav = await utilities.getNav();
    let dropdown = await utilities.getClassificationOptions(classification_id);
    const itemName = `${inv_make} ${inv_model}`
    res.render("inventory/edit-inventory", {
      errors,
      inv_id,
      title: "Edit " + itemName,
      nav,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      dropdown,
    });
    return;
  }
  next();
};

module.exports = validate;
