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

// 단위 조회
const itemUnit = async () => {
  let list = await mariadb.query("itemUnit");
  return list;
};

// 품목 삭제
const deleteItem = async (itemId) => {
  let resInfo = await mariadb.query("itemDelete", [itemId]);

  if (resInfo.affectedRows > 0) {
    return {
      result: true,
    };
  } else {
    return {
      result: false,
    };
  }
};

// 품목 수정
const modifyItem = async (item) => {
  let updateData = convertToArray(item, [
    "item_name",
    "item_type",
    "unit",
    "spec",
    "cutd_cond",
    "uon",
    "remk",
    "item_id",
  ]);
  let resInfo = await mariadb.query("itemUpdate", updateData);

  if (resInfo.affectedRows > 0) {
    return {
      result: true,
    };
  } else {
    return {
      result: false,
    };
  }
};

// 품목 등록
const addItem = async (item) => {
  let insertData = convertToArray(item, [
    "item_name",
    "item_type",
    "unit",
    "spec",
    "cutd_cond",
    "uon",
    "remk",
  ]);
  let resInfo = await mariadb.query("itemInsert", insertData);

  if (resInfo.affectedRows > 0) {
    return {
      result: true,
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
  addItem,
  itemId,
  lotId,
  itemtype,
  cutdCond,
  whId,
  itemList,
  modifyItem,
  deleteItem,
  itemUnit,
};
