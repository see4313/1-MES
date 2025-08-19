// server/services/failureTypeService.js
const mapper = require("../database/mapper");

async function getAll() {
  try {
    // sqlList.js 안에 selectFailureTypes 가 정의되어 있어야 함
    const rows = await mapper.query("selectFailureTypes");
    return rows;
  } catch (err) {
    throw err;
  }
}

module.exports = { getAll };
