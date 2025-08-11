const mariadb = require("../database/mapper.js");
// 실제로 제공하는 기능 : 요구사항에 따라 달라짐

// 재고목록 조회
const inventoryList = async (filters) => {
  let list = await mariadb.query("inventoryList", filters);
  return list;
};

// 품목목록 조회
const itemList = async (filters) => {
  let list = await mariadb.query("itemList", filters);
  return list;
};

// 품목번호 조회
const itemId = async () => {
  let list = await mariadb.query("itemId");
  return list;
};

// LOT번호 조회
const lotId = async () => {
  let list = await mariadb.query("lotId");
  return list;
};

// 품목구분 조회
const itemtype = async () => {
  let list = await mariadb.query("itemType");
  return list;
};

// 보관조건 조회
const cutdCond = async () => {
  let list = await mariadb.query("cutdCond");
  return list;
};

// 창고번호 조회
const whId = async () => {
  let list = await mariadb.query("whId");
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
  inventoryList,
  addNew,
  itemId,
  lotId,
  itemtype,
  cutdCond,
  whId,
  itemList,
};
