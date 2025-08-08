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
  logger: {
    query: console.log,
    error: console.log,
  },
});

const query = async (alias, values) => {
  let conn = null;
  try {
    conn = await connectionPool.getConnection();
    let executeSql = sqlList[alias];
    let result = await conn.query(executeSql, values);
    return result;
  } catch (e) {
    console.error(e);
  } finally {
    if (conn) conn.release(); // 커넥션 반환 필수
  }
};

module.exports = { query };
