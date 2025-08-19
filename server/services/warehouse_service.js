const db = require("../database/mapper.js");
//조회
const warehouseList = async (filters = {}) =>
  db.query("warehouseList", filters);
//등록
const warehouseCreate = async (payload = {}) =>
  db.query("warehouseCreate", payload);
//중복체크
const existsNameAndLoca = async (
  warehouseName,
  warehouseLoca,
  excludeWhId = null
) => {
  const rows = await db.query("existsByNameAndLoca", {
    warehouseName,
    warehouseLoca,
    excludeWhId,
  });
  return Number(rows?.[0]?.cnt || 0) > 0;
};
//수정
const warehouseUpdate = (id, payload = {}) =>
  db.query("warehouseUpdate", { id, ...payload });

// 보관조건 조회 모달
const cutdCond = async () => {
  let list = await db.query("cutdCond");
  return list;
};

module.exports = {
  cutdCond,
  warehouseList,
  warehouseCreate,
  existsNameAndLoca,
  warehouseUpdate,
};
