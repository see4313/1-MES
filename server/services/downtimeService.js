const mapper = require("../database/mapper");

// 비가동 조회
async function getDowntimeList(filters) {
  try {
    const rows = await mapper.query("selectDowntimeList", filters);
    return rows;
  } catch (err) {
    throw new Error("비가동 조회 실패: " + err.message);
  }
}

// 비가동 등록
async function insertDowntime(data) {
  try {
    await mapper.query("insertDowntime", [
      data.facility_id,
      data.emp_id,
      data.down_type_id,
      data.down_start_dt,
      data.down_end_dt,
      data.oper_yn,
      data.remk,
    ]);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// 비가동 정정(수정)
async function updateDowntime(data) {
  try {
    await mapper.query("updateDowntime", [
      data.facility_id,
      data.emp_id,
      data.down_type_id,
      data.down_start_dt,
      data.down_end_dt,
      data.oper_yn,
      data.remk,
      data.edit_reason,
      data.down_id,
    ]);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// 비가동 무효 처리
async function voidDowntime(data) {
  try {
    await mapper.query("voidDowntime", [data.edit_reason, data.down_id]);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

module.exports = {
  getDowntimeList,
  insertDowntime,
  updateDowntime,
  voidDowntime,
};
