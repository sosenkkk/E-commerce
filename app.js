const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");

const errorController= require('./controllers/error')

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const rootDir = require("./util/path");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.use(shopRoutes);

app.use("/admin", adminRoutes);

app.use(errorController.get404);

app.listen(3000);
