const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const expressHbs = require("express-handlebars");

const app = express();

app.engine(
  "hbs",
  expressHbs({ layoutDir: "views/layouts/", defaultLayout: "main-layout", extname: 'hbs' })
);
app.set("view engine", "hbs");
app.set("views", "views");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const rootDir = require("./util/path");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.use(shopRoutes);

app.use("/admin", adminRoutes.routes);

app.use((req, res, next) => {
  // res.status(404).sendFile(path.join(rootDir, 'views', '404.html'))
  res.status(404).render("404", { pageTitle: "Error" });
});

app.listen(3000);
