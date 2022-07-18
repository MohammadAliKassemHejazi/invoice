const User = require("../models/User");

exports.getLogin = (req, res, next) => {
  res.render("user/index", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: "",
    validationErrors: [],
    isAuthenticated: req.session.isloggedIn,
    isAdmin: req.session.admin,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email, password: password })
    .then((result) => {
      if (!result) {
        return res.status(422).render("user/index", {
          path: "/login",
          pageTitle: "Login",
          errorMessage: "",
          validationErrors: [],
          isAuthenticated: req.session.isloggedIn,
          isAdmin: req.session.admin,
        });
      }
      return result;
    })
    .then((result) => {
      if (result.email === "ADMIN@ADMIN.COM") {
        req.session.admin = true;
      } else {
        req.session.admin = false;
      }

      req.session.user = result;
      req.session.isloggedIn = true;
      res.render("user/invoices-list", {
        path: "/invoices-list",
        prods: "",
        pageTitle: "Add User",
        errorMessage: "",
        validationErrors: [],
        isAuthenticated: req.session.isloggedIn,
        isAdmin: req.session.admin,
        Invoices: [],
      });
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.isloggedIn = false;
  req.session.user = null;
  res.render("user/index", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: "",
    validationErrors: [],
    isAuthenticated: req.session.isloggedIn,
    isAdmin: req.session.admin,
  });
};
