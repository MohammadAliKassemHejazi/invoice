const Invoice = require("../models/Invoice");
const User = require("../models/User");
const mongoose = require("mongoose");

exports.getIndex = (req, res, next) => {
  res.render("user/index", {
    errorMessage: "",
    pageTitle: "User",
    path: "/",
    isAuthenticated: "",
    validationErrors: [],
  });
};

exports.getInvoices = (req, res, next) => {
  res.render("user/invoices-list", {
    errorMessage: "",
    pageTitle: "User",
    path: "/",
    isAuthenticated: req.session.isloggedIn,
    validationErrors: [],
  });
};

exports.getaddInvoice = (req, res, next) => {
  User.find()
    .then((result) => {
      console.log(result);
      const emails = result.map((users) => {
        return users.email;
      });
      res.render("user/add-invoice", {
        errorMessage: "",
        pageTitle: "User",
        path: "/",
        isAuthenticated: req.session.isloggedIn,
        user: req.session.user.email,
        emails: emails,
        validationErrors: [],
      });
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.postaddInvoice = (req, res, next) => {
  const from = req.session.user._id;
  const to = req.body.to;
  const us = req.body.us;
  const fr = req.body.fr;
  let client;
  User.find({ email: to })
    .then((result) => {
      client = result;
      const invoice = new Invoice({
        From: from,
        To: result[0]._id,
        Us: us,
        Fr: fr,
      });

      return invoice.save();
    })
    .then((invoice) => {
      console.log(req.session.user);
      // from.addToInvoices(invoice);
      // client.addToInvoices(invoice);

      res.render("user/invoices-list", {
        errorMessage: "",
        pageTitle: "User",
        path: "/",
        isAuthenticated: req.session.isloggedIn,
        validationErrors: [],
      });
    })
    .catch((e) => {
      console.log(e);
    });
};
