const User = require("../../models/user");
const { createSecretToken } = require("../../middlewares/secret_token");
const bcrypt = require("bcrypt");

module.exports.getRegister = async (req, res) => {
  try {
    const success = req.flash("success");
    const error = req.flash("error");
    res.render("login/register", {
      title: "Register",
      success,
      error,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.postRegister = async (req, res) => {
  try {
    const { username, cid, email, password } = req.body;
    let errorMessage = null;

    if (!username) {
      errorMessage = "Username field cannot be empty";
    } else if (!cid) {
      errorMessage = "CID field cannot be empty";
    } else if (!email) {
      errorMessage = "Email field cannot be empty";
    } else if (!password) {
      errorMessage = "Password field cannot be empty";
    }

    if (errorMessage) {
      console.log(errorMessage);
      req.flash("error", errorMessage);
      return res.redirect("/register");
    } else {
      const existing_user = await User.findOne({ email });
      if (existing_user) {
        req.flash("error", "User already exists");
        return res.redirect("/register"); // Add return here
      }
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(password, salt);
      const user = await User.create({
        username,
        cid,
        email,
        password: hashPassword,
      });
      const token = createSecretToken(user._id);
      res.cookie("token", token, {
        withCredentials: true, // Fix the typo here
        httpOnly: false,
      });
      req.flash("success", "User registered successfully");
    }
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    req.flash("error", "An error occurred");
    res.redirect("/register");
  }
};
