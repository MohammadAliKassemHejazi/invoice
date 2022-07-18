const express = require("express");

const usersController = require("../controllers/user");
const isAuth = require("../middleware/is-auth");
const isAdmin = require("../middleware/is-admin");

const router = express.Router();

router.get("/", usersController.getIndex);

router.get("/add-invoice", isAuth, usersController.getaddInvoice);

router.post("/add-invoice", isAuth, usersController.postaddInvoice);

router.get("/invoices-list", isAuth, usersController.getInvoices);

router.get("/orders/:orderId", isAdmin, isAuth, usersController.getInvoice);

router.post("/orders/delete", isAdmin, isAuth, usersController.postdelete);

module.exports = router;
/////invoiceId
