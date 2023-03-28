const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const csrf= require('csurf');
const flash= require('connect-flash')
const errorController = require("./controllers/error");
// const db = require("./util/database");

const app = express();
// const mongoConnect = require("./util/database").mongoConnect;
const User = require("./models/user");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const store = new MongoDBStore({
  uri: "mongodb+srv://sosenkkk:sosenk@cluster0.rfcsb3n.mongodb.net/shop",
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const { collection } = require("./models/user");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));


app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

const csrfProtection= csrf();
app.use(csrfProtection);

app.use(flash());

app.use((req, res, next)=>{
  if(!req.session.user){
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user= user;
      next()
    })
    .catch((err) => {
      console.log(err);
    });
});
app.use((req, res, next)=>{
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
})

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

// mongoConnect(() => {
//   app.listen(3000);
// });

mongoose
  .connect(
    "mongodb+srv://sosenkkk:sosenk@cluster0.rfcsb3n.mongodb.net/shop?retryWrites=true&w=majority"
  )
  .then((result) => {
    

    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
