// services/inspitem.service.js
const mapper = require("../database/mapper.js");
// 목록
async function getInspItems() {
  return await mapper.query("inspitem");
}

async function createInspItem(body) {
  const params = [
    body.INSP_NM,
    body.INSP_MTHD,
    body.INSP_TYP,
    body.BASI_VAL,
    body.UNIT,
    body.UON,
    body.PRCS_FG,
    body.REMK,
  ];
  const ret = await mapper.query("inspInsert", params);
  return ret;
}

async function updateInspItem(id, body) {
  const params = [
    body.INSP_NM,
    body.INSP_MTHD,
    body.INSP_TYP,
    body.BASI_VAL,
    body.UNIT,
    body.UON,
    body.PRCS_FG,
    body.REMK,
    id,
  ];
  const ret = await mapper.query("inspUpdate", params);
  return ret;
}

// 삭제
async function deleteInspItem(id) {
  const ret = await mapper.query("inspDelect", [id]);
  return ret;
}

// 검사서 세부 조회
const examDetail = async (filters) => {
  let list = await mapper.query("examDetail", filters);
  return list;
};

// 검사항목 조회
const inspList = async (filters) => {
  let list = await mapper.query("inspList", filters);
  return list;
};

// 생산실적 조회
const prodList = async () => {
  let list = await mapper.query("prodList");
  return list;
};

// 검사 등록
const examInsert = async (data) => {
  let resInfo = await mapper.query("examInsert", [
    data.item_id,
    data.emp_id,
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

// 제품검사 실적 등록
const examHisInsert = async (data) => {
  let resInfo = await mapper.query("examHisInsert", [
    data.rsrt_id,
    data.item_id,
    data.emp_id,
    data.sttus,
    data.exam_qty,
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

module.exports = {
  getInspItems,
  createInspItem,
  updateInspItem,
  deleteInspItem,
  inspList,
  examInsert,
  examDetail,
  prodList,
  examHisInsert,
};
