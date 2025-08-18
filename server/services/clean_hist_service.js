const mapper = require("../database/mapper.js");
const asRows = (r) => (Array.isArray(r) ? r : r?.rows || r || []);

async function listCleanHist(f = {}) {
  const p = [
    f.facility_id ?? null,
    f.facility_id ?? null,
    f.emp_id ?? null,
    f.emp_id ?? null,
    f.from_dt ?? null,
    f.from_dt ?? null,
    f.to_dt ?? null,
    f.to_dt ?? null,
  ];
  return asRows(await mapper.query("CLEAN_HIST.LIST", p));
}

async function insertCleanHist(d = {}) {
  const params = [
    d.facility_id,
    d.emp_id,
    d.clean_start_dt,
    d.clean_end_dt,
    d.remk ?? null,
  ];
  const r = await mapper.query("CLEAN_HIST.INSERT", params);
  return r?.insertId ?? r?.[0]?.insertId ?? null;
}

async function updateCleanHist(d = {}) {
  const params = [
    d.facility_id,
    d.emp_id,
    d.clean_start_dt,
    d.clean_end_dt,
    d.remk ?? null,
    d.hist_id,
  ];
  const r = await mapper.query("CLEAN_HIST.UPDATE", params);
  return (r?.affectedRows ?? r?.[0]?.affectedRows ?? 0) > 0;
}

async function voidCleanHist(hist_id) {
  const r = await mapper.query("CLEAN_HIST.DELETE", [hist_id]);
  return (r?.affectedRows ?? r?.[0]?.affectedRows ?? 0) > 0;
}

module.exports = {
  listCleanHist,
  insertCleanHist,
  updateCleanHist,
  voidCleanHist,
};
