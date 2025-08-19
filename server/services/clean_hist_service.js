// server/services/clean_hist_service.js

const mapper = require("../database/mapper.js");
const asRows = (r) => (Array.isArray(r) ? r : r?.rows || r || []);

// 조회
async function listCleanHist(filters = {}) {
  // filters는 cleanHistList 함수에 전달됨
  return asRows(await mapper.query("cleanHistList", filters));
}

// 등록
async function insertCleanHist(d = {}) {
  const params = [
    d.facility_id,
    d.emp_id,
    d.clean_start_dt,
    d.clean_end_dt,
    d.remk ?? null,
  ];
  const r = await mapper.query("cleanHistInsert", params);
  return r?.insertId ?? r?.[0]?.insertId ?? null;
}

// 수정
async function updateCleanHist(d = {}) {
  const params = [
    d.facility_id ?? null,
    d.emp_id ?? null,
    d.clean_start_dt ?? null,
    d.clean_end_dt ?? null,
    d.remk ?? null,
    d.hist_id,
  ];
  const r = await mapper.query("cleanHistUpdate", params);
  return (r?.affectedRows ?? r?.[0]?.affectedRows ?? 0) > 0;
}

// 무효처리
async function voidCleanHist(hist_id = null) {
  const params = [hist_id];
  const r = await mapper.query("cleanHistVoid", params);
  return (r?.affectedRows ?? r?.[0]?.affectedRows ?? 0) > 0;
}

module.exports = {
  listCleanHist,
  insertCleanHist,
  updateCleanHist,
  voidCleanHist,
};
