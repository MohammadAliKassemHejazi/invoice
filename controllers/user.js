const Invoice = require("../models/Invoice");
const User = require("../models/User");
const mongoose = require("mongoose");

const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

exports.getIndex = (req, res, next) => {
  res.render("user/index", {
    errorMessage: "",
    pageTitle: "User",
    path: "/",
    isAuthenticated: req.session.isloggedIn,
    isAdmin: req.session.admin,
    validationErrors: [],
  });
};

exports.getInvoices = (req, res, next) => {
  req.user
    .populate({
      path: "invoices.items.invoiceId",
      populate: { path: "From To" },
    })

    .then((result) => {
      const view = result.invoices.items.map((value) => {
        return {
          _id: value.invoiceId._id.toString(),
          From: value.invoiceId.From.email,
          To: value.invoiceId.To.email,
          Us: value.invoiceId.Us,
          Fr: value.invoiceId.Fr,
          created: value.invoiceId.createdAt + "",
        };
      });

      return view;
    })
    .then((view) => {
      res.render("user/invoices-list", {
        errorMessage: "",
        pageTitle: "User",
        path: "/",
        isAuthenticated: req.session.isloggedIn,
        isAdmin: req.session.admin,
        validationErrors: [],
        Invoices: view,
      });
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.getaddInvoice = (req, res, next) => {
  User.find()
    .then((result) => {
      const emails = result.map((users) => {
        return users.email;
      });
      res.render("user/add-invoice", {
        errorMessage: "",
        pageTitle: "User",
        path: "/",
        isAuthenticated: req.session.isloggedIn,
        isAdmin: req.session.admin,
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
  const from = req.body.from;
  const to = req.body.to;
  const us = req.body.us;
  const fr = req.body.fr;
  let FROM;
  let TO;

  User.find({ email: from })
    .then((result) => {
      FROM = result;

      return;
    })
    .then(() => {
      return User.find({ email: to }).then((result) => {
        TO = result;
        const invoice = new Invoice({
          From: FROM[0]._id,
          To: result[0]._id,
          Us: us,
          Fr: fr,
        });

        return invoice.save();
      });
    })
    .then((invoice) => {
      try {
        TO[0].addToInvoices(invoice);
        FROM[0].addToInvoices(invoice);
      } catch (e) {
        console.log(e);
      }
      res.render("user/invoices-list", {
        errorMessage: "",
        pageTitle: "User",
        path: "/",
        isAuthenticated: req.session.isloggedIn,
        isAdmin: req.session.admin,
        validationErrors: [],
        Invoices: [],
      });
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;

  Invoice.findById(orderId)
    .then((result) => {
      return result.populate({
        path: "From To",
      });
    })
    .then((order) => {
      if (!order) {
        return next(new Error("No order found."));
      }

      const invoiceName = "invoice-" + orderId + ".pdf";
      const invoicePath = path.join("data", "invoices", invoiceName);

      const pdfDoc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline; filename="' + invoiceName + '"'
      );
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(26).text("Invoice   ", {
        underline: true,
      });
      pdfDoc.fontSize(20).text(order.createdAt + "", {
        underline: true,
      });
      pdfDoc.text("-----------------------");
      pdfDoc.fontSize(14).text(`From : ${order.From.email}`);
      pdfDoc.fontSize(14).text(`To : ${order.To.email}`);
      pdfDoc.fontSize(14).text(`US : ${order.Us}`);
      pdfDoc.fontSize(14).text(`FR : ${order.Fr}`);

      pdfDoc.end();
    })
    .catch((err) => next(err));
};

exports.postdelete = async (req, res, next) => {
  const orderId = req.body.Id;
  const to = req.body.To;
  await User.find({ email: to })
    .then((user) => {
      const invoiceName = "invoice-" + orderId + ".pdf";

      fs.unlink(`data\\invoices\\${invoiceName}`, (err) => {
        console.log(err);
      });
      return user;
    })
    .then((user) => {
      user[0].removeFromCart(orderId);
    })
    .catch((e) => {
      console.log(e);
    });

  Invoice.deleteOne({ _id: orderId })
    .then(() => {
      return req.user.removeFromCart(orderId);
    })
    .then((result) => {
      res.render("user/invoices-list", {
        errorMessage: "",
        pageTitle: "User",
        path: "/",
        isAuthenticated: req.session.isloggedIn,
        isAdmin: req.session.admin,
        validationErrors: [],
        Invoices: [],
      });
    })
    .catch((e) => {
      console.log(e);
    });
};
