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

module.exports = {
  getInspItems,
  createInspItem,
  updateInspItem,
  deleteInspItem,
};
