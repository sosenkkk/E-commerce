const User = require("../models/user");
exports.getLogin = (req, res, next) => {
  // const isLoggedIn= req.get('Cookie').split(';')[0].trim().split('=')[1];
  // console.log(req.get('Cookie').split(';')[0].trim().split('=')[1]);
  console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "login",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("641dcf8a7122adb64ddf9a4a")
    .then((user) => {
      console.log("s");
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        console.log(err);
        res.redirect("/");
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
