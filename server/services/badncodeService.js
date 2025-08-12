const mapper = require("../database/mapper.js");

async function getBadnCode() {
  return await mapper.query("badnSelect");
}

module.exports = { getBadnCode };
