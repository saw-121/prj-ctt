const User = require("../../models/user");
const Result = require("../../models/result");

module.exports.getDashboard = async (req, res) => {
  try {
    const success = req.flash("success");
    const error = req.flash("error");
    const user = await User.find({});
    return res.render("admin/dashboard", {
      title: "Admin Dashboard",
      success,
      error,
      users: user || "No users found!",
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "An error occurred, please try again!");
    return res.redirect("/admin/dashboard");
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const success = req.flash("success");
    const error = req.flash("error");
    const userId = req.params.id;
    const foundUser = await User.findByIdAndDelete(userId);
    
    if (!foundUser) {
      req.flash('error', 'User not found');
    } else {
      req.flash('success', `User with name ${foundUser.username} has been deleted.`);
    }

    return res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Error deleting user:', error);
    req.flash('error', 'An error occurred, please try again.');
    return res.redirect('/admin/dashboard');
  }
};


module.exports.getResult = async(req, res) => {
  try{
    const success = req.flash("success");
    const error = req.flash("error");
    const result = await Result.find({});
    return res.render("admin/result", {
      title: "Result",
      success,
      error,
      results: result || "No result found!",
    });
  }catch(error){
    console.error('Error deleting user:', error);
    req.flash('error', 'An error occurred, please try again.');
    return res.redirect('/admin/result');
  }
}

module.exports.deleteResult = async (req, res) => {
  try {
    const success = req.flash("success");
    const error = req.flash("error");
    const resultId = req.params.id;
    const foundResult = await Result.findByIdAndDelete(resultId);
    
    if (!foundResult) {
      req.flash('error', 'Result not found');
    } else {
      req.flash('success', `User with name ${foundResult.username} has been deleted.`);
    }

    return res.redirect('/admin/result');
  } catch (error) {
    console.error('Error deleting user:', error);
    req.flash('error', 'An error occurred, please try again.');
    return res.redirect('/admin/result');
  }
};
