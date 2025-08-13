const mapper = require("../database/mapper.js");

function convertToArray(obj, keys) {
  return keys.map((k) => obj[k]);
}

async function getBadnCode() {
  return await mapper.query("badnSelect");
}
const insertBadnCode = async (badnInfo) => {
  const insertData = convertToArray(badnInfo, [
    "BADN_NAME",
    "BADN_RESN",
    "INSP_MTHD",
    "UON",
  ]);

  const resInfo = await mapper.query("badnInsert", insertData);

  if (resInfo?.affectedRows == 1) {
    return { result: true };
  } else {
    return { result: false };
  }
};

module.exports = { getBadnCode, insertBadnCode };
