const mariadb = require("../database/mapper.js");
// 실제로 제공하는 기능 : 요구사항에 따라 달라짐

// 재고목록 조회
const inventoryList = async (filters) => {
  let list = await mariadb.query("inventoryList", filters);
  return list;
};

// 출고이력 조회
const historyList = async (filters) => {
  let list = await mariadb.query("historyList", filters);
  return list;
};

// 로그인 조회
const userLogin = async (filters) => {
  let list = await mariadb.query("userLogin", filters);
  return list;
};

// 품목목록 조회
const itemList = async (filters) => {
  let list = await mariadb.query("itemList", filters);
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

// 거래처 조회
const selectVend = async () => {
  let list = await mariadb.query("selectVend");
  return list;
};

// 사원 조회
const selectEmp = async (filters) => {
  let list = await mariadb.query("selectEmp", filters);
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
    "exp_date",
    "safe_qty",
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
    "conv_qty",
    "exp_date",
    "safe_qty",
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

// 발주 등록
const procInsert = async (data) => {
  let resInfo = await mariadb.query("procInsert", [
    data.vend_id,
    data.emp_id,
    data.reg_date,
    data.pap_date,
    data.remark,
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

// 발주 조회
const selectProc = async (params) => {
  let list = await mariadb.query("selectProc", params);
  return list;
};

// 발주상세 조회
const selectProcDetail = async (params) => {
  let list = await mariadb.query("selectProcDetail", params);
  return list;
};

// 입고 처리
const receive = async (data) => {
  let resInfo = await mariadb.query(
    "receive",
    [JSON.stringify(data)] // 프로시저에서 JSON 파싱
  );

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

// 반품 처리
const itemReturn = async (data) => {
  let resInfo = await mariadb.query(
    "itemReturn",
    [JSON.stringify(data)] // 프로시저에서 JSON 파싱
  );

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

// 폐기 처리
const itemdispose = async (data) => {
  let resInfo = await mariadb.query(
    "itemdispose",
    [JSON.stringify(data)] // 프로시저에서 JSON 파싱
  );

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
  lotId,
  itemtype,
  cutdCond,
  whId,
  itemList,
  modifyItem,
  deleteItem,
  itemUnit,
  selectVend,
  selectEmp,
  procInsert,
  selectProc,
  selectProcDetail,
  receive,
  itemReturn,
  itemdispose,
  historyList,
  userLogin,
};
