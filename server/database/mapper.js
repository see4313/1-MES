require("dotenv").config(); // .env 파일 로드
const mariadb = require("mariadb");
const sqlList = require("./sqlList.js");

const connectionPool = mariadb.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: process.env.DB_CONNECTION_LIMIT || 10,

  insertIdAsNumber: true,
  bigIntAsNumber: true,
  permitSetMultiParamEntries: true,
  multipleStatements: true,
  logger: {
    query: console.log,
    error: console.log,
  },
});

// const query = async (alias, values) => {
//   let conn = null;
//   try {
//     conn = await connectionPool.getConnection();
//     let exeuteSql = sqlList[alias];
//     let result = await conn.query(exeuteSql, values);
//     return result;
//   } catch (e) {
//     console.log(e);
//   } finally {
//     conn.release();
//   }
// };

// 조회 필터링을 위해서 쿼리가 문자열인 경우외에 함수일 경우에도 처리할 수 있게 설정
const query = async (alias, values) => {
  let conn = null;
  try {
    conn = await connectionPool.getConnection();
    let sqlEntry = sqlList[alias];

    let sql, params;
    if (typeof sqlEntry === "function") {
      const result = sqlEntry(values || {});
      sql = result.sql;
      params = result.params;
    } else {
      sql = sqlEntry;
      params = values || [];
    }

    let result = await conn.query(sql, params);
    return result;
  } catch (e) {
    console.log(e);
  } finally {
    if (conn) conn.release();
  }
};

module.exports = { query };
