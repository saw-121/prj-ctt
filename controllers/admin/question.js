const Question = require("../../models/question");

module.exports.getAddQuestion = async (req, res) => {
  try {
    return res.render("admin/addquestion", {
      title: "Question Bank",
      error: req.flash("error"),
      success: req.flash("success"),
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "An error occurred, please try again!");
    return res.redirect("/admin/dashboard");
  }
};

module.exports.postAddQuestion = async (req, res) => {
  try {
    const {
      question,
      option1,
      option2,
      option3,
      option4,
      difficulty,
      correct,
    } = req.body;

    if (
      !question ||
      !option1 ||
      !option2 ||
      !option3 ||
      !option4 ||
      !difficulty ||
      !correct
    ) {
      req.flash("error", "Some fields are empty!");
      return res.redirect("/admin/addquestion");
    }
    const newQuiz = new Question({
      question,
      options: [
        option1.toLowerCase(),
        option2.toLowerCase(),
        option3.toLowerCase(),
        option4.toLowerCase(),
      ],
      correctOption: correct.toLowerCase(),
      difficulty,
    });

    newQuiz
      .save()
      .then((saveQuiz) => {
        req.flash("success", `New ${difficulty} has been successfully added.`);
        return res.redirect("/admin/addquestion");
      })
      .catch((error) => {
        console.log(error);
        req.flash("error", "An error occurred, please try again.");
        return res.redirect("/admin/addquestion");
      });
  } catch (error) {
    console.log(error);
    req.flash("error", "An error occurred, please try again.");
    return res.redirect("/admin/dashboard");
  }
};

var currentDate = new Date();
var currentYear = currentDate.getFullYear();

module.exports.getDisplayQuestion = async (req, res) => {
  try {
    const questions = await Question.find({year: currentYear});
    if (!questions) {
      req.flash("error", "No quiz questions added.");
      return res.redirect("/admin/displayquestion");
    }

    return res.render("admin/displayquestion", {
      title: "Display Question",
      questions,
      error: req.flash("error"),
      success: req.flash("success"),
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "An error occurred, please try again.");
    return res.redirect("/admin/displayquestion");
  }
};

//Display easy questions of current year
module.exports.getDisplayEasyQuestion = async (req, res) => {
  try {
    const questions = await Question.find({year: currentYear, difficulty: "easy"});
    if (!questions) {
      req.flash("error", "No easy questions.");
      return res.redirect("/admin/displayquestion");
    }

    return res.render("admin/displaydifficulty", {
      title: "Easy Question",
      questions,
      error: req.flash("error"),
      success: req.flash("success"),
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "An error occurred, please try again.");
    return res.redirect("/admin/displayquestion");
  }
};

//Display medium questions of current year
module.exports.getDisplayMediumQuestion = async (req, res) => {
  try {
    const questions = await Question.find({year: currentYear, difficulty: "medium"});
    if (!questions) {
      req.flash("error", "No medium questions.");
      return res.redirect("/admin/displayquestion");
    }

    return res.render("admin/displaydifficulty", {
      title: "Medium Question",
      questions,
      error: req.flash("error"),
      success: req.flash("success"),
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "An error occurred, please try again.");
    return res.redirect("/admin/displayquestion");
  }
};

//Display hard questions of current year
module.exports.getDisplayHardQuestion = async (req, res) => {
  try {
    const questions = await Question.find({year: currentYear, difficulty: "hard"});
    if (!questions) {
      req.flash("error", "No hard questions.");
      return res.redirect("/admin/displayquestion");
    }

    return res.render("admin/displaydifficulty", {
      title: "Hard Question",
      questions,
      error: req.flash("error"),
      success: req.flash("success"),
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "An error occurred, please try again.");
    return res.redirect("/admin/displayquestion");
  }
};

module.exports.getEditQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const question = await Question.findById(questionId);
    if (!question) {
      req.flash(
        "error",
        `No question with question ID ${questionId}, please try again!`
      );
      return res.redirect("/admin/displayquestion");
    }

    return res.render("admin/editquestion", {
      title: "Edit Question",
      question,
      error: req.flash("error"),
      success: req.flash("success"),
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "An error occurred, please try again.");
    return res.redirect("/admin/dashboard");
  }
};

module.exports.updateQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const { question, option1, option2, option3, option4, correct } = req.body;

    if (!question || !option1 || !option2 || !option3 || !option4 || !correct) {
      req.flash("error", "Some fields are empty!");
      return res.redirect(`/admin/editquestion/${questionId}`);
    }

    const updatedQuestion = {
      question,
      options: [option1, option2, option3, option4],
      correctOption: correct,
    };

    const result = await Question.findByIdAndUpdate(
      questionId,
      updatedQuestion,
      {
        new: true,
      }
    );

    if (!result) {
      req.flash("error", `No question with ID ${questionId} found.`);
      return res.redirect("/admin/displayquestion");
    }

    req.flash("success", "Question updated successfully.");
    return res.redirect("/admin/displayquestion");
  } catch (error) {
    console.error(error);
    req.flash("error", "An error occurred, please try again.");
    res.redirect("/admin/displayquestion");
  }
};

//Past Questions
module.exports.getDisplayPastQuestion = async (req, res) => {
  try {
    const questions = await Question.find({ year: { $ne: currentYear } });
    if (!questions) {
      req.flash("error", "No past questions.");
      return res.redirect("/admin/pastquestion");
    }

    return res.render("admin/pastquestion", {
      title: "Past Question",
      questions,
      error: req.flash("error"),
      success: req.flash("success"),
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "An error occurred, please try again.");
    return res.redirect("/admin/pastquestion");
  }
};
