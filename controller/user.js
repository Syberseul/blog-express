const { exec, escape } = require("../db/mysql.js");
const { genPassword } = require("../utils/cryp");

const login = (username, password) => {
  // 生成加密密码
  password = genPassword(password);

  // 当用户输入 username 为 username'-- 时，将会忽略 password 而直接进行登录验证
  // 当用户输入 username 为 username'; delete from users -- 时，将会直接删除张三的表格
  // 使用 escape 会使用户输入的所有字符进行整体使用
  username = escape(username);
  password = escape(password);

  const sql = `select username, realname from users where username=${username} and password=${password}`;

  // console.log("sql is: ", sql);
  return exec(sql).then((rows) => {
    return rows[0] || {};
  });
};

module.exports = {
  login,
};
