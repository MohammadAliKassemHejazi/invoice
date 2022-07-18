const express = require("express");

const adminController = require("../controllers/admin");

const isAuth = require("../middleware/is-auth");
const isAdmin =require("../middleware/is-admin");

const router = express.Router();

router.get("/add-user", isAuth,isAdmin, adminController.getAddUser);

router.post("/add-user", isAuth,isAdmin, adminController.postAddUser);

module.exports = router;
