const crypto = require("crypto");

// 定义密匙
const SECRET_KEY = "Whg_1ngf#_22";

// md5 加密
const md5 = (content) => {
  let md5 = crypto.createHash("md5");
  return md5.update(content).digest("hex");
};

// 执行加密函数
const genPassword = (password) => {
  const str = `password=${password}&key=${SECRET_KEY}`;
  return md5(str);
};

// const res = genPassword("123");
// console.log(res);

module.exports = {
  genPassword,
};
