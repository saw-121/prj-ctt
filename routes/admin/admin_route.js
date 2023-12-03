const express = require("express");
const router = express.Router();
const {
  getDashboard,
  deleteUser,
  getResult,
  deleteResult
} = require("../../controllers/admin/dashboard");
const { loginRequired } = require("../../middlewares/protected");
const {
  getAddQuestion,
  postAddQuestion,
  getDisplayQuestion,
  getEditQuestion,
  updateQuestion,
  getDisplayPastQuestion,
  getDisplayEasyQuestion,
  getDisplayMediumQuestion,
  getDisplayHardQuestion,
} = require("../../controllers/admin/question");

const { getGenerateQuiz, postGenerateQuiz, getDisplayQuiz } = require("../../controllers/admin/quiz");

router.get("/dashboard", loginRequired, getDashboard);
router.get("/dashboard/:id/delete", loginRequired, deleteUser);

router.get("/addquestion", loginRequired, getAddQuestion);
router.post("/addquestion", loginRequired, postAddQuestion);

router.get("/displayquestion", loginRequired, getDisplayQuestion);
router.get("/editquestion/:id", loginRequired, getEditQuestion);
router.put("/editquestion/:id", loginRequired, updateQuestion);

router.get("/createquiz", loginRequired, getGenerateQuiz);
router.post("/createquiz", loginRequired, postGenerateQuiz);

router.get("/displayquiz", loginRequired, getDisplayQuiz);

router.get("/pastquestion", loginRequired, getDisplayPastQuestion);

router.get("/result", loginRequired, getResult);
router.get("/result/:id/delete", loginRequired, deleteResult);

router.get("/displayeasyquestions", loginRequired, getDisplayEasyQuestion);
router.get("/displaymediumquestions", loginRequired, getDisplayMediumQuestion);
router.get("/displayhardquestions", loginRequired, getDisplayHardQuestion);

module.exports = router;