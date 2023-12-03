const Question = require("../../models/question");

var currentDate = new Date();
var currentYear = currentDate.getFullYear();

module.exports.getDashboard = async (req, res) => {
  try {
    const success = req.flash("success");
    const error = req.flash("error");

    // Use the distinct method to get a list of unique years
    const uniqueYears = await Question.distinct("year");

    // Filter out the current year
    const filteredYears = uniqueYears.filter((year) => year !== currentYear);

    // Fetch questions for the filtered years
    const questions = await Question.find({ year: { $in: filteredYears } });

    // if (!filteredYears.length) {
    //   req.flash("error", "No past questions.");
    //   return res.redirect("/users/dashboard");
    // }

    return res.render("users/dashboard", {
      title: "Past Questions",
      success,
      error,
      year: filteredYears || 0,
      questions: questions || "No question found!",
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "An error occurred, please try again!");
    return res.redirect("/users/dashboard");
  }
};

module.exports.postDashboard = async (req, res) => {
  try {
    const success = req.flash("success");
    const error = req.flash("error");

    // Fetch questions for the filtered years
    const questions = await Question.find({ year: req.body.yearFilter });

    return res.render("users/year", {
      title: "Past Questions",
      success,
      error,
      year: req.body.yearFilter,
      questions: questions || "No question found!",
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "An error occurred, please try again!");
    return res.redirect("/users/dashboard");
  }
};
