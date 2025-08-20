const mariadb = require("../database/mapper.js");
// 실제로 제공하는 기능 : 요구사항에 따라 달라짐

// 제품전체조회
const productList = async (filters) => {
  let list = await mariadb.query("productList", filters);
  return list;
};

// 완제품입고등록 목록
const insertList = async (filters) => {
  let list = await mariadb.query("insertList", filters);
  return list;
};

// 출고관리 목록
const deliveryList = async (filters) => {
  let list = await mariadb.query("deliveryList", filters);
  return list;
};

// 입고관리
const productInsert = async (data) => {
  let resInfo = await mariadb.query("productInsert", [JSON.stringify(data)]);
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

// 완제품 출고
const productUpdate = async (data) => {
  let resInfo = await mariadb.query("productUpdate", [JSON.stringify(data)]);

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
  productUpdate,
  setDelivery,
  deliveryList,
  productInsert,
};
