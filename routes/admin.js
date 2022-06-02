const express = require("express");

const adminController = require("../controllers/admin");

const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/add-user", isAuth, adminController.getAddUser);

router.post("/add-user", isAuth, adminController.postAddUser);

module.exports = router;
