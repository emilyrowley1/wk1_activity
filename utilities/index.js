const invModel = require("../models/inventory-model");
const Util = {};
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors"/></a>';
      grid += '<div class="namePrice">';
      grid += "<hr/>";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build the Details view HTML
 * ************************************ */
Util.buildDetailsViewHtml = async function (data) {
  let htmlToReturn = "";

  if (data.length > 0) {
    data.forEach((vehicle) => {
      htmlToReturn += '<div id="details">';
      htmlToReturn +=
        '<img src="' +
        vehicle.inv_image +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" />';
      htmlToReturn +=
        "<h2>" +
        vehicle.inv_year +
        " " +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        " Details</h2>";
      htmlToReturn += '<div id="details-info">';
      htmlToReturn +=
        "<p><b>Price:</b> $" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</p>";
      htmlToReturn +=
        "<p><b>Description: </b>" + vehicle.inv_description + "</p>";
      htmlToReturn += "<p><b>Color: </b>" + vehicle.inv_color + "</p>";
      htmlToReturn +=
        "<p><b>Miles: </b>" +
        Intl.NumberFormat().format(vehicle.inv_miles) +
        "</p>";
      htmlToReturn += "</div></div>";
    });
  }

  return htmlToReturn;
};
/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ************************
 * Constructs the dropdown to add to inventory
 ************************** */
Util.getClassificationOptions = async function (optionSelected) {
  let data = await invModel.getClassifications();
  let list = `<select id='classificationList' name='classification_id' required>
  <option value="">Please select a classification</option>`;
  data.rows.forEach((row) => {
    list +=`<option value="${row.classification_id}"
    ${row.classification_id === Number(optionSelected) ? 'selected': ''} > 
      ${row.classification_name}
      </option>`;
  });
  list += '</select>';
  return list;
};

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("errors", "Please log in.");
    return res.redirect("/account/login");
  }
};

/* ****************************************
 *  Check Account Type
 * ************************************ */
Util.checkAccountType = (req, res, next) => {
  if (res.locals.accountData.account_type == "Admin" || res.locals.accountData.account_type == "Employee") {
    next();
  } else {
    req.flash("errors", "You don't have credentials.");
    return res.redirect("/");
  }
};

module.exports = Util;
