const db = require("../database/mapper.js");

const processList = async (filters = {}) => db.query("processList", filters);

const createProcess = async (payload = {}) =>
  db.query("processCreate", payload);

const updateProcess = async (payload = {}) =>
  db.query("processUpdate", payload);

const processTypeList = async (filters = {}) => {
  return db.query("processTypeList", filters);
};

module.exports = { processList, createProcess, updateProcess, processTypeList };
