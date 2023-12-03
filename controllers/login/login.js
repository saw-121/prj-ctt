const User = require("../../models/user");
const bcrypt = require("bcrypt");
const { createSecretToken } = require("../../middlewares/secret_token");

module.exports.getLogin = (req, res) => {
  try {
    const success = req.flash("success");
    const error = req.flash("error");
    res.render("login/login", { title: "Login", error, success });
  } catch (error) {
    console.log(error);
  }
};

module.exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      req.flash("error", "Field empty.");
      return res.redirect("/");
    }
    const user = await User.findOne({ email });

    if (!user) {
      req.flash("error", `User doesn't exist with email ${email}`);
      return res.redirect("/");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      req.flash("error", "Wrong password, please try again!");
      return res.redirect("/");
    }

    const token = createSecretToken(user._id); // Replace with your token generation logic

    res.cookie("token", token, {
      httpOnly: true, // Change to true for security reasons
    });

    if(user.role === "admin"){
      return res.redirect("/admin/dashboard");
    }

    return res.redirect("/users/dashboard");
  } catch (error) {
    console.error(error); // Log the error for debugging
    req.flash("error", "An error occurred during login");
    return res.redirect("/");
  }
};

module.exports.logout = (req, res) => {
  res.clearCookie("token");
  return res.redirect("/");
};
