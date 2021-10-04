var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  // router.get('/abc', function(req, res, next) { - 此处为子路由
  res.render("index", { title: "Express" });
});

module.exports = router;
