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

module.exports = {
  facilityList,
  facilityNames,
  facilityTypes,
  facilityUsers,
};
(async () => {
  const mariadb = require("../database/mapper.js");
  const result = await mariadb.query("facilityList", {});
  console.log("facilityList 테스트 결과:", result);
})();
