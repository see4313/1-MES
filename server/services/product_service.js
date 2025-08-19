const mariadb = require("../database/mapper.js");
// 실제로 제공하는 기능 : 요구사항에 따라 달라짐

// 제품전체조회
const productList = async (filters) => {
  let list = await mariadb.query("productList", filters);
  return list;
};

// 완제품입고등록 목록
const insertList = async () => {
  let list = await mariadb.query("insertList");
  return list;
};

// 출고관리 목록
const deliveryList = async () => {
  let list = await mariadb.query("deliveryList");
  return list;
};

// 완제품 입고
const productInsert = async (data) => {
  let list = convertToArray(item, [
    "item_id",
    "wh_id",
    "crea_datem",
    "vald_date",
    "entebord_qty",
    "dlivy_qty",
    "bnt",
    "status",
  ]);
  let resInfo = await mariadb.query("productInsert", insertData);

  if (resInfo.affctedRows > 0) {
    return {
      result: true,
    };
  } else {
    return {
      result: false,
    };
  }
};

// 출고 관리 목록
const setDelivery = async (filters) => {
  let list = await mariadb.query("setDelivery", filters);
  return list;
};

// 모달(생산지시)
const prodModal = async () => {
  let list = await mariadb.query("prodModal");
  return list;
};
module.exports = {
  prodModal,
  productList,
  insertList,
  productInsert,
  setDelivery,
  deliveryList,
};
