const mapper = require("../database/mapper.js");
const mariadb = require("../database/mapper.js");
// BOM 전체 목록 조회
async function bomList() {
  const result = await mapper.query("bomList");
  return Array.isArray(result) ? result : result?.rows || [];
}

async function bomDetails(bomNumber) {
  const result = await mapper.query("bomDetails", [bomNumber]);
  return Array.isArray(result) ? result : result?.rows || [];
}
module.exports = {
  bomList,
  bomDetails,
};
