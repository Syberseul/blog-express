var createError = require("http-errors"); // 处理 404 问题
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
const RedisStore = require("connect-redis")(session); // RedisStore 是一个函数
const fs = require("fs");

// var indexRouter = require("./routes/index"); // 引用路由
// var usersRouter = require("./routes/users"); // 引用路由
const blogRouter = require("./routes/blog");
const userRouter = require("./routes/user");

var app = express(); // 生成实例req.session.username

// // view engine setup - 前端页面的引用设置
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "jade");

// 处理 log 并在不同环境下输出不同 log
const ENV = process.env.NODE_ENV;
if (ENV !== "production") {
  // 开发环境 / 测试环境
  app.use(logger("dev")); // 写日志
} else {
  // 线上环境
  const logFileName = path.join(__dirname, "logs/access.log");
  const writeStream = fs.createWriteStream(logFileName, {
    flags: "a",
  });
  app.use(logger("combined", { stream: writeStream }));
}

app.use(express.json()); // 处理 POST 请求，将 json 数据传给 req.body
app.use(express.urlencoded({ extended: false })); // POST 兼容其他格式
app.use(cookieParser()); // 获取cookie
// app.use(express.static(path.join(__dirname, "public"))); // 对应 public 文件夹

// 创建 session store
const redisClient = require("./db/redis");
const sessionStore = new RedisStore({
  client: redisClient,
});

// 解析 session - 要在配置路由之前解析
app.use(
  session({
    secret: "Wjfgh%bb_95510#",
    cookie: {
      // path: "/", // 默认配置
      // httpOnly: true, // 默认配置
      maxAge: 24 * 60 * 60 * 1000,
    },
    store: sessionStore,
  })
);

// 此处为父路径,在 routes 对应的 js 文件内设置子路径
// app.use("/", indexRouter); // 处理路由
// app.use("/users", usersRouter); // 处理路由
app.use("/api/blog", blogRouter);
app.use("/api/user", userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "dev" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
