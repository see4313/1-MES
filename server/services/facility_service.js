// server/services/facility_service.js
const mariadb = require("../database/mapper.js");

// 설비목록 조회
const facilityList = async (filters) => {
  return await mariadb.query("facilityList", filters);
};

// 설비명 목록 (모달)
const facilityNames = async () => {
  return await mariadb.query("facilityNames");
};

// 설비유형 목록 (모달)
const facilityTypes = async () => {
  return await mariadb.query("facilityTypes");
};

// 담당자 목록 (모달)
const facilityUsers = async () => {
  return await mariadb.query("facilityUsers");
};

// 설비 등록
const facilityInsert = async (data) => {
  return await mariadb.query("facilityInsert", [
    data.facility_nm,
    data.facility_type,
    data.emp_id,
    data.purchase_dt,
    data.temp_val,
    data.humidity_val,
    data.rpm_val,
    data.power_val,
    data.remk,
  ]);
};

// 설비 수정
const facilityUpdate = async (data) => {
  return await mariadb.query("facilityUpdate", [
    data.facility_nm,
    data.facility_type,
    data.emp_id,
    data.purchase_dt,
    data.temp_val,
    data.humidity_val,
    data.rpm_val,
    data.power_val,
    data.remk,
    data.facility_id,
  ]);
};

// 설비 삭제
const facilityDelete = async (facility_id) => {
  return await mariadb.query("facilityDelete", [facility_id]);
};

module.exports = {
  facilityList,
  facilityNames,
  facilityTypes,
  facilityUsers,
  facilityInsert,
  facilityUpdate,
  facilityDelete,
};
