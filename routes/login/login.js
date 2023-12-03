const express = require("express");
const router = express.Router(); // Use express.Router() here
const { getLogin, postLogin, logout } = require("../../controllers/login/login");
const { getRegister, postRegister } = require("../../controllers/login/register");

router.get("/", getLogin);
router.post("/", postLogin);

router.get("/register", getRegister);
router.post("/register", postRegister);

router.get("/logout", logout);

module.exports = router;
