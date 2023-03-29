const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const csrf= require('csurf');
const flash= require('connect-flash')
const errorController = require("./controllers/error");
const multer= require('multer');

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
const csrfProtection= csrf();

const fileStorage= multer.diskStorage({
  destination: (req, file, cb)=>{
    cb(null, 'images');
  },
  filename:(req, file, cb)=>{
    cb(null,  new Date().getTime() + '-' + file.originalname);
  }
});
const fileFilter=(req, file, cb)=>{
  if(file.mimetype==='image/png' || file.mimetype === 'image/jpg' || file.mimetype=== 'image/jpeg'){
    cb(null, true );
  }else{
    cb(null, false)

  }
}

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({storage: fileStorage, fileFilter:fileFilter}).single('image'));
app.use(express.static(path.join(__dirname, "public")));
app.use('/images',express.static(path.join(__dirname, "images")));

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

app.use((req, res, next)=>{
  if(!req.session.user){
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if(!user){
        return next();
      }
      req.user= user;
      next()
    })
    .catch((err) => {
      throw new Error(err);
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

app.get('/500', errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next)=>{
  res.redirect('/500')

})

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
