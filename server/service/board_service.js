// board_service.js

const mariadb = require("../db/mapper.js");

const findAll = async () => {
  let list = await mariadb.query("selectBoardList");
  return list;
};
  
const addNew = async (boardInfo) => {
  let insertData = convertToArray(boardInfo, ["name", "writer", "info"]);
 let resInfo = await mariadb.query("boardInsert", insertData);

  if(resInfo.insertId > 0) {
    return {
      result: true,
      no: resInfo.insertId,
    }
  } else {
    return {
      result: false
    }
  }
};

function convertToArray(obj, cols) {
  let result = [];
  for (let col of cols) {
    result.push(obj[col]);
  }
  return result;
}

module.exports = {
  findAll
  , addNew
};