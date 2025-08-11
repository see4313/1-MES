const mapper = require("../database/mapper.js");

async function getInspItems() {
  return await mapper.query("inspitem");
}

module.exports = { getInspItems };
