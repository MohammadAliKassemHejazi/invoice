const express = require("express");

const usersController = require("../controllers/user");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/", usersController.getIndex);

router.get("/add-invoice", isAuth, usersController.getaddInvoice);

router.post("/add-invoice", isAuth, usersController.postaddInvoice);

router.get("/invoices-list", isAuth, usersController.getInvoices);

module.exports = router;
