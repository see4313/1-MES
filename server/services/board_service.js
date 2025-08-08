const mariadb = require("../database/mapper.js");
// 실제로 제공하는 기능 : 요구사항에 따라 달라짐

// 전체조회
const findAll = async () => {
  let list = await mariadb.query("test");
  return list;
};

// 등록
const addNew = async (boardInfo) => {
  // boardInfo : { 'title', : '', 'writer' : '', 'content' : '' }
  let insertData = convertToArray(boardInfo, ["title", "writer", "content"]);
  let resInfo = await mariadb.query("boardInsert", insertData);

  if (resInfo.insertId > 0) {
    return {
      result: true,
      no: resInfo.insertId,
    };
  } else {
    return {
      result: false,
    };
  }
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
  addNew,
};
