const Question = require("../../models/question");
const Quiz = require("../../models/quiz");

function timeConvert(timeInput) {
  const timeArray = timeInput.split(":");
  const hours = parseInt(timeArray[0]);
  const minutes = parseInt(timeArray[1]);

  const seconds = hours * 3600 + minutes * 60;
  return seconds;
}

module.exports.getGenerateQuiz = async (req, res) => {
  try {
    return res.render("admin/createquiz", {
      title: "Create Quiz",
      error: req.flash("error"),
      success: req.flash("success"),
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "An error occurred, please try again!");
    return res.redirect("/admin/dashboard");
  }
};

const generatedQuestions = [];

// Function to generate a random question from the question bank
async function getRandomQuestion(difficulty) {
  const questionBank = await Question.find();
  const filteredQuestions = questionBank.filter(
    (question) => question.difficulty === difficulty
  );
  const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
  return filteredQuestions[randomIndex];
}

// Generate random questions from the question bank
async function generateRandomQuestions(difficulty, totalQuestions) {
  for (let i = 0; i < totalQuestions; i++) {
    let newQuestion;

    do {
      newQuestion = await getRandomQuestion(difficulty);
    } while (generatedQuestions.includes(newQuestion._id));

    // console.log(newQuestion);

    // Push the question ID to the array
    generatedQuestions.push(newQuestion._id);
  }
}

module.exports.postGenerateQuiz = async (req, res) => {
  try {
    const {
      totalQuestion,
      totalEasyQuestion,
      totalMediumQuestion,
      totalHardQuestion,
      year,
      startTime,
      timeLimit,
    } = req.body;

    if (
      !totalQuestion ||
      !totalEasyQuestion ||
      !totalMediumQuestion ||
      !totalHardQuestion ||
      !year ||
      !timeLimit ||
      !startTime
    ) {
      req.flash("error", "Field cannot be empty!");
      return res.redirect("/admin/createquiz");
    } else if (
      totalQuestion < 0 ||
      totalEasyQuestion < 0 ||
      totalMediumQuestion < 0 ||
      totalHardQuestion < 0
    ) {
      req.flash("error", "Field cannot be less than zero.");
      return res.redirect("/admin/createquiz");
    }

    const totalQuestionNumber =
      parseInt(totalEasyQuestion) +
      parseInt(totalMediumQuestion) +
      parseInt(totalHardQuestion);

    if (totalQuestion != parseInt(totalQuestionNumber)) {
      req.flash(
        "error",
        "Total Question is not equal to easy + medium + hard."
      );
      return res.redirect("/admin/createquiz");
    }

    const findEasyQuestion = await Question.find({
      difficulty: "easy",
      year: year,
    });
    const findMediumQuestion = await Question.find({
      difficulty: "medium",
      year: year,
    });
    const findHardQuestion = await Question.find({
      difficulty: "hard",
      year: year,
    });

    if (!findEasyQuestion.length) {
      req.flash(
        "error",
        "Easy is not available in the question bank. Please add questions to the question bank."
      );
      return res.redirect("/admin/createquiz");
    } else if (findEasyQuestion.length < totalEasyQuestion) {
      req.flash(
        "error",
        "Easy question is less in question bank. Please add questions to the question bank."
      );
      return res.redirect("/admin/createquiz");
    } else if (!findMediumQuestion.length) {
      req.flash(
        "error",
        "Medium is not available in the question bank. Please add questions to the question bank."
      );
      return res.redirect("/admin/createquiz");
    } else if (findMediumQuestion.length < totalMediumQuestion) {
      req.flash(
        "error",
        "Medium question is less in question bank. Please add questions to the question bank."
      );
    } else if (!findHardQuestion.length) {
      req.flash(
        "error",
        "Hard is not available in the question bank. Please add questions to the question bank."
      );
      return res.redirect("/admin/createquiz");
    } else if (findHardQuestion.length < totalHardQuestion) {
      req.flash(
        "error",
        "Hard question is less in question bank. Please add questions to the question bank."
      );
      return res.redirect("/admin/createquiz");
    }

    // Generate and add easy questions
    if (totalEasyQuestion > 0) {
      await generateRandomQuestions("easy", totalEasyQuestion);
    }

    // Generate and add medium questions
    if (totalMediumQuestion > 0) {
      await generateRandomQuestions("medium", totalMediumQuestion);
    }

    // Generate and add hard questions
    if (totalHardQuestion > 0) {
      await generateRandomQuestions("hard", totalHardQuestion);
    }

    // Create a new quiz object with references to the generated questions
    const newQuiz = new Quiz({
      questions: generatedQuestions,
      timeLimit: parseInt(timeConvert(timeLimit)),
      startTime: startTime,
    });

    // Save the new quiz object to the database
    const totalQuizLength = await Quiz.find({});

    if (totalQuizLength.length === 1) {
      req.flash("error", "Quiz already generated.");
      return res.redirect("/admin/createquiz");
    } else {
      await newQuiz.save();

      req.flash("success", "Quiz generated successfully");
      return res.redirect("/admin/createquiz");
    }
  } catch (error) {
    console.log(error);
    req.flash("error", "An error occurred, please try again!");
    return res.redirect("/admin/createquiz");
  }
};

module.exports.getDisplayQuiz = async (req, res) => {
  try {
    // Fetch all quizzes to get the question references
    const quizzes = await Quiz.find();
    const quizquestions = await Question.find();

    // Create an empty array to store matching objects
    const matchingObjects = [];

    // Iterate through each quiz
    for (const quiz of quizzes) {
      // Iterate through each question ID in the quiz
      for (const questionId of quiz.questions) {
        const hexString = questionId.toString();
        const matchingQuestion = quizquestions.find(
          (q) => q._id.toString() === hexString
        );

        // If a matching question is found, add it to the matchingObjects array
        if (matchingQuestion) {
          matchingObjects.push(matchingQuestion);
        }
      }
    }

    // console.log(matchingObjects);
    const times = quizzes.map((item) => item.timeLimit);
    // Render the EJS view and pass the matchingObjects to it
    res.render("admin/displayquiz", {
      questions: matchingObjects,
      title: "Display Quiz",
      times: times || 0,
    }); // Assuming you have a view engine set up
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
