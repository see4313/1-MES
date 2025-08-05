const mariadb = require("mariadb");
const sqlList = require("./sqlList.js");

const connectionPool = mariadb.createPool({
  // DB에 접속하는 정보
  host: "localhost",
  port: 3306,
  user: "dev01",
  password: "dev01",
  database: "dev",
  connectionLimit: 10,

  // autoincrement로 증가하는 값이 number타입으로 넘어오지 않기때문에 설정
  insertIdAsNumber: true,
  // bigInt 타입이 자바스크립트에서 자동변환이 이루어지지 않기때문에 number으로 변환하기 위해 설정
  bigIntAsNumber: true,
  // ?가 여러값을 가지는 경우 mariadb에서 매핑하기 위해 설정
  permitSetMultiParamEntries: true,
  logger: {
    query: console.log,
    error: console.log,
  },
});

const query = async (alias, values) => {
  let conn = null;
  try {
    // DB와 연결해야하기 때문에 무조건 비동기
    conn = await connectionPool.getConnection();
    let executeSql = sqlList[alias];
    let result = await conn.query(executeSql, values);
    return result;
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  query,
};
