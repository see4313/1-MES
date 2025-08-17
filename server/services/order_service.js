const mariadb = require("../database/mapper.js");
// 실제로 제공하는 기능 : 요구사항에 따라 달라짐

// 전체조회
const orderList = async (filters) => {
  let list = await mariadb.query("orderList", filters);
  return list;
};

// 상세조회
const detailOrder = async (order_id) => {
  let list = await mariadb.query("detailOrder", order_id);
  return list;
};

// 상세단건삭제
const deleteOrder = async (detail_id) => {
  let list = await mariadb.query("deleteOrder", [detail_id]);
  return list;
};

// 모달(담당자)
const empModal = async () => {
  let list = await mariadb.query("empModal");
  return list;
};

// 모달(주문)
const orderModal = async () => {
  let list = await mariadb.query("orderModal");
  return list;
};

// 모달(상세주문)
const itemModal = async () => {
  let list = await mariadb.query("itemModal");
  return list;
};

// 모달(창고주문)
const whModal = async () => {
  let list = await mariadb.query("whModal");
  return list;
};

// 모달(생산지시)
const prodModal = async () => {
  let list = await mariadb.query("prodModal");
  return list;
};

//등록
const orderInsert = async (data) => {
  let resInfo = await mariadb.query("orderInsert", [
    data.ordr,
    data.emp_id,
    data.vend_id,
    data.ordr_date,
    data.paprd_date,
    data.remk,
    JSON.stringify(data.details), // 프로시저에서 JSON 파싱
  ]);

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

function orderToArray(obj, columns) {
  let result = [];
  for (let column of columns) {
    result.push(obj[column]);
  }
  return result;
}

// 주문수정
const setOrder = async (data) => {
  let ordInfo = await mariadb.query("setOrder", [
    data.order_id,
    data.vend_id,
    data.emp_id,
    data.ordr,
    data.ordr_date,
    data.paprd_date,
    data.remk,
    JSON.stringify(data.details), // 프로시저에서 JSON 파싱
  ]);
  if (ordInfo.affectedRows > 0) {
    return {
      result: true,
    };
  } else {
    return {
      result: false,
    };
  }
};

module.exports = {
  orderList,
  orderInsert,
  empModal,
  orderModal,
  detailOrder,
  itemModal,
  setOrder,
  orderToArray,
  deleteOrder,
  whModal,
  prodModal,
};
