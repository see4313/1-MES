//DB에 접근해 데이터를 조회하거나 조작(등록, 수정, 삭제)를 담당하는 파일
const mariadb = require("mariadb/callback");

const sqlList = require("./sqlList.js");

const connectionPool = mariadb.createPool({
  // DB에 접속하는 정보

  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_DB,
  connectionLimit: process.env.DB_LIMIT,

  permitSetMultiParamEntries: true,

  insertIdAsNumber: true,

  bigIntAsNumber: true,

  logger: {
    query: console.log,
    error: console.error,
  },
});

const query = (alias, values) => {
  return new Promise((resolve, reject) => {
    let executeSql = sqlList[alias];

    connectionPool.query(executeSql, values, (err, results) => {
      if (err) {
        // error 발생시
        reject({ err });
      } else {
        // SQL문을 정상적으로 실행한 경우
        resolve(results);
      }
    });
  });
};

module.exports = {
  query,
};
