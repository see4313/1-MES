const mariadb = require("../database/mapper.js");
// 실제로 제공하는 기능 : 요구사항에 따라 달라짐

// 전체조회
const findAll = async () => {
  let list = await mariadb.query("orderList");
  return list;
};

function convertToArray(obj, columns) {
  let result = [];
  for (let column of columns) {
    result.push(obj[column]);
  }
  return result;
}

//등록
const addNew = async (boardInfo) => {
  let insertData = convertToArray(boardInfo, [
    "order_id",
    "emp_id",
    "ordr_date",
    "paprd_date",
    "remk",
  ]);
  let resInfo = await mariadb.query("orderInsert", insertData);
};

module.exports = {
  findAll,
  addNew,
};
