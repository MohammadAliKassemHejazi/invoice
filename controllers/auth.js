const User = require("../models/User");

exports.getLogin = (req, res, next) => {
  res.render("user/index", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: "",
    validationErrors: [],
    isAuthenticated: req.session.isloggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email, password: password })
    .then((result) => {
      console.log(result);

      if (!result) {
        return res.status(422).render("user/index", {
          path: "/login",
          pageTitle: "Login",
          errorMessage: "",
          validationErrors: [],
          isAuthenticated: req.session.isloggedIn,
        });
      }

      req.session.user = result;
      req.session.isloggedIn = true;
      res.render("user/invoices-list", {
        path: "/invoices-list",
        prods: "",
        pageTitle: "User",
        errorMessage: "",
        validationErrors: [],
        isAuthenticated: req.session.isloggedIn,
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
  });
};
