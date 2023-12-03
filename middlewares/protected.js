const cookie = require("cookie-parser");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports.loginRequired = (req, res, next) => {
  try {
    const token = req.cookies["token"];
    
    if (!token) {
      req.flash("error", "You are not logged in. Please log in.");
      return res.redirect("/");
    }
    
    try {
      const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
      if (decodedToken) {
        // Token is valid
        res.User = decodedToken._id;
        return next();
      }
    } catch (verifyError) {
      req.flash("error", "Your login session has expired. Please log in again.");
      return res.redirect("/");
    }
  } catch (error) {
    console.error(error);
    req.flash("error", "An error occurred. Please try again.");
    return res.redirect("/");
  }
};
