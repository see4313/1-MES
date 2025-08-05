const mariadb = require("mariadb");
const sqlList = require("./sqlList.js");

const connectionPool = mariadb.createPool({
  host: 'localhost',
  port: 3306,
  user: 'dev01',
  password: 'dev01',
  database: 'dev',
  connectionLimit: 10,

  insertIdAsNumber: true,
  // dataType convert bigInt => number
  bigIntAsNumber: true,
  // javascript object => mariadb ex) set ?
  permitSetMultiParamEntries: true,
  logger: {
    query: console.log,
    error: console.error
  }
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
  }
};

module.exports = {
  query,
  mariadb
};
