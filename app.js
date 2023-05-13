const dotenv = require("dotenv").config();
const path = require("path");
const express = require("express");
const https = require("https")
const bodyParser = require("body-parser");
const csrf = require("csurf");
const fs = require("fs");
const flash = require("connect-flash");
const errorController = require("./controllers/error");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const app = express();
const fileUpload = require("express-fileupload")
const User = require("./models/user");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const mongoUrl = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.rfcsb3n.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

const store = new MongoDBStore({
  uri: mongoUrl,
  collection: "sessions",
});

const csrfProtection = csrf();
const privateKey = fs.readFileSync('server.key');
const certificate= fs.readFileSync('server.cert');



app.use(fileUpload({
  useTempFiles:true
}))



app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  useDefaults: true,
    directives: {
      "img-src": ["'self'", "https: data:"]
    }
}))
app.use(compression());
app.use(morgan("combined", {stream: accessLogStream}));

app.use(bodyParser.urlencoded({ extended: false }));
// app.use(
//   multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
// );
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(csrfProtection);

app.use(flash());

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
      next();
    })
    .catch((err) => {
      throw new Error(err);
    });
});
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get("/500", errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
  res.redirect("/500");
});

mongoose
  .connect(mongoUrl)
  .then((result) => {
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => {
    console.log(err);
  });
