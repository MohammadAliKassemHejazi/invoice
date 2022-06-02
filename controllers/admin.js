const User = require("../models/User");

exports.getAddUser = (req, res, next) => {
  res.render("admin/add-user", {
    pageTitle: "Add Users",
    path: "/admin/add-user",
    errorMessage: null,
    isAuthenticated: req.session.isloggedIn,
    validationErrors: [],
  });
};

exports.postAddUser = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((result) => {
      if (result) {
        return res.render("admin/add-user", {
          pageTitle: "Add Users",
          path: "/admin/add-user",
          errorMessage: "user Already exists",
          isAuthenticated: req.session.isloggedIn,
          validationErrors: [],
        });
      }
      const user = new User({
        email: email,
        password: password,
      });
      user
        .save()
        .then((result) => {
          res.render("admin/add-user", {
            pageTitle: "Add Users",
            path: "/admin/add-user",
            errorMessage: null,
            isAuthenticated: req.session.isloggedIn,
            validationErrors: [],
          });
        })
        .catch((e) => {
          next(e);
        });
    })

    .catch((e) => {
      next(e);
    });
};
