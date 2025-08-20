const db = require("../database/mapper.js");

const processList = async (filters = {}) => db.query("processList", filters);

const createProcess = async (payload = {}) =>
  db.query("processCreate", payload);

const updateProcess = async (payload = {}) =>
  db.query("processUpdate", payload);

const processTypeList = async (filters = {}) => {
  return db.query("processTypeList", filters);
};
//삭제
const deleteProcess = async (prcsNo) => {
  let resInfo = await db.query("processDelete", [prcsNo]);

  if (resInfo.affectedRows > 0) {
    return {
      result: true,
    };
  } else {
    return {
      result: false,
    };
  }
};
module.exports = {
  deleteProcess,
  processList,
  createProcess,
  updateProcess,
  processTypeList,
};
