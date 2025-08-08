const mariadb = require("../database/mapper.js");
// 실제로 제공하는 기능 : 요구사항에 따라 달라짐

// 전체조회
const findAll = async () => {
  let list = await mariadb.query("vend");
  return list;
};

function convertToArray(obj, columns) {
  let result = [];
  for (let column of columns) {
    result.push(obj[column]);
  }
  return result;
}

module.exports = {
  findAll,
};
