const Question = require("../../models/question");
const Quiz = require("../../models/quiz");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const Result = require("../../models/result");

module.exports.getStartPage = async (req, res) => {
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
    const timeLimit = quizzes.map((item) => item.timeLimit);
    const startTime = quizzes.map((item) => item.startTime);

    // console.log(matchingObjects);

    // Render the EJS view and pass the matchingObjects to it
    res.render("users/startquiz", {
      questions: matchingObjects,
      timeLimit,
      startTime,
      title: "Start On",
    }); // Assuming you have a view engine set up
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.getStartQuiz = async (req, res) => {
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
    const timeLimit = quizzes.map((item) => item.timeLimit);
    const startTime = quizzes.map((item) => item.startTime);

    // console.log(matchingObjects);

    // Render the EJS view and pass the matchingObjects to it
    res.render("users/displayquiz", {
      questions: matchingObjects,
      timeLimit,
      startTime,
      title: "Start Quiz",
    }); // Assuming you have a view engine set up
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.postStartQuiz = async (req, res) => {
  try {
    const { result } = req.body;
    const token = req.cookies['token'];

    if (!token) {
      return res.status(401).send('Unauthorized');
    }

    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    const findUser = await User.findById(decodedToken.id);

    if (decodedToken) {
      const existingUser = await Result.findOne({ email: findUser.email });

      if (existingUser) {
        req.flash('error', 'You have already attempted the quiz!');
      } else {
        const newResult = new Result({
          username: findUser.username,
          cid: findUser.cid,
          email: findUser.email,
          score: result,
        });
        await newResult.save();
        req.flash(
          'success',
          'Thank you for attending the quiz. The result will be declared on our website. Please check our website at www.gcit.edu.bt for updates.'
        );
      }

      return res.redirect('/users/dashboard');
    }
  } catch (error) {
    console.error(error);
    req.flash('error', 'Internal Server Error');
    res.status(500).send('Internal Server Error');
  }
};
