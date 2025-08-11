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

//등록
const orderInsert = async () => {
  let insertData = orderToArray([
    "order_name",
    "emp_id",
    "vend_id",
    "ordr_date",
    "paprd_date",
    "remk",
  ]);
  let resInfo = await mariadb.query("orderInsert", insertData);
  return resInfo;
};

function orderToArray(obj, columns) {
  let result = [];
  for (let column of columns) {
    result.push(obj[column]);
  }
  return result;
}

module.exports = {
  orderList,
  orderInsert,
  empModal,
  orderModal,
  detailOrder,
};
