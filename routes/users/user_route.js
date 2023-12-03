const express = require("express");
const router = express.Router();
const { getStartQuiz, getStartPage, postStartQuiz } = require("../../controllers/users/quiz");
const { getDashboard, postDashboard } = require("../../controllers/users/dashboard");
const { loginRequired } = require("../../middlewares/protected");

router.get("/displayquiz", loginRequired, getStartQuiz);
router.post("/displayquiz", loginRequired, postStartQuiz);
router.get("/dashboard", loginRequired, getDashboard);
router.post("/dashboard", loginRequired, postDashboard);

router.get("/starton", loginRequired, getStartPage);

module.exports = router;