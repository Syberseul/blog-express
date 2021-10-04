const { exec, escape } = require("../db/mysql");
// 预防 xss 攻击，将敏感符号转化 - > 变成 &lt; < 变成 &gt;
const xss = require("xss");

const getList = (author, keyword) => {
  let sql = `select * from blogs where 1=1 `;
  // 1=1 是确保当 author 或者 keyword 没有值的时候不报错
  if (author) {
    sql += `and author='${author}' `;
  }
  if (keyword) {
    sql += `and title like '%${keyword}%' `;
  }
  sql += `order by createtime desc`;

  // 返回 promise
  return exec(sql);
};

const getDetail = (id) => {
  id = escape(id);
  const sql = `select * from blogs where id=${id}`;
  return exec(sql).then((rows) => {
    return rows[0];
  });
};

const newBlog = (blogData = {}) => {
  // blogData 是一个博客对象，包含 title, content, author 属性
  const { title, content, author } = blogData;
  title = xss(escape(title));
  content = xss(escape(content));
  author = escape(author);
  const createTime = Date.now();

  const sql = `insert into blogs (title, content, createtime, author) values (${title}, ${content}, '${createTime}', ${author})`;

  return exec(sql).then((insertData) => {
    // console.log("insert data is: ", insertData);
    return {
      id: insertData.insertId,
    };
  });
};

const updateBlog = (id, blogData = {}) => {
  // id 是要更新博客的 id
  // blogData 是一个博客对象，包含 title content 属性
  const { title, content } = blogData;
  title = xss(escape(title));
  content = xss(escape(content));
  const sql = `update blogs set title=${title}, content=${content} where id='${id}'`;

  return exec(sql).then((updateData) => {
    // console.log("update data is: ", updateData);
    if (updateData.affectedRows > 0) {
      return true;
    }
    return false;
  });
};

const delBlog = (id, author) => {
  // id 是要删除博客的 id
  id = escape(id);
  author = escape(author);
  const sql = `delete from blogs where id=${id} and author=${author}`;

  return exec(sql).then((delData) => {
    console.log("delete data is: ", delData);
    if (delData.affectedRows > 0) {
      return true;
    }
    return false;
  });
};

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog,
};
