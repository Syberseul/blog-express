var express = require("express");
var router = express.Router();
const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog,
} = require("../controller/blog");
const { SuccessModel, ErrorModel } = require("../model/resModel");
const loginCheck = require("../middleware/loginCheck");

router.get("/list", (req, res, next) => {
  // // res.json 可以直接返回一个 json 格式的文件
  // // 并且直接增加一个 content-type 的 head
  // res.json({
  //   errno: 0,
  //   data: [1, 2, 3],
  // });
  let author = req.query.author || "";
  const keyword = req.query.keyword || "";

  if (req.query.isadmin) {
    // 管理员界面
    if (req.session.username === null) {
      // 未登录
      res.json(new ErrorModel("not login yet"));
      return;
    }
    // 强制查询自己的博客
    author = req.session.username;
  }

  const result = getList(author, keyword);
  return result.then((listData) => {
    res.json(new SuccessModel(listData));
  });
});

router.get("/detail", (req, res, next) => {
  // res.json({
  //   errno: 0,
  //   data: "ok",
  // });
  const result = getDetail(req.query.id);
  return result.then((data) => {
    res.json(new SuccessModel(data));
  });
});

router.post("/new", loginCheck, (req, res, next) => {
  req.body.author = req.session.username;
  const result = newBlog(req.body);
  return result.then((data) => {
    res.json(new SuccessModel(data));
  });
});

router.post("/update", loginCheck, (req, res, next) => {
  const result = updateBlog(req.query.id, req.body);
  return result.then((val) => {
    if (val) {
      res.json(new SuccessModel());
    } else {
      res.json(new ErrorModel("update failed"));
    }
  });
});

router.post("/delete", loginCheck, (req, res, next) => {
  const author = req.session.username;
  const result = delBlog(req.query.id, author);
  return result.then((val) => {
    if (val) {
      res.json(new SuccessModel());
    } else {
      res.json(new ErrorModel("delete blog failed"));
    }
  });
});

module.exports = router;
