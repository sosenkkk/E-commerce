const express = require("express");
const path = require("path");

const rootDir = require("../util/path");

const router = express.Router();

const product = [];

router.get("/add-product", (req, res, next) => {
  // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS:true,
    productCSS:true,
    activeProduct: true

  });
});

router.post("/add-product", (req, res, next) => {
  product.push({ title: req.body.title });
  res.redirect("/");
});

exports.routes = router;
exports.products = product;
