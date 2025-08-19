const mapper = require("../database/mapper.js");
async function getSummary() {
  return await dashboardMapper.selectSummary();
}

async function getFailures() {
  return await dashboardMapper.selectFailures();
}

async function getUpcoming() {
  return await dashboardMapper.selectUpcoming();
}

module.exports = { getSummary, getFailures, getUpcoming };
