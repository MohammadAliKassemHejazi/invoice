const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const errorController = require("./controllers/error");
const User = require("./models/User");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(
  session({ secret: "my secret ", resave: false, saveUninitialized: false })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/data", express.static(path.join(__dirname, "data")));

const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      if (user.email === "ADMIN@ADMIN.COM") {
        req.session.admin = true;
      } else {
        req.session.admin = false;
      }
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

///css peek
///Gitlens
///import Cost
///Errorlens

app.use("/admin", adminRoutes);
app.use(userRoutes);
app.use(authRoutes);
app.use(errorController.get404);

app.use((error, req, res, next) => {
  res.status(500).render("500", {
    pageTitle: "Error!",
    path: "/500",
    isAuthenticated: req.session.isloggedIn,
    isAdmin: req.session.admin,
  });
});

mongoose
  .connect(
    "mongodb+srv://aliimohssenn:Amohsen@2022@cluster0.zgyhl.mongodb.net/Invoice?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )

  .then((result) => {
    app.listen(3001);
  })
  .catch((err) => {
    console.log(err);
  });
