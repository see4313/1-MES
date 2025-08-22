// productionService.js
const db = require("../database/mapper");

const bomItemList = async (filters) => {
  let list = await db.query("bomItemList", filters);
  return list;
};

const addProdInstructions = async (data) => {
  try {
    const result = await db.query("insertProdInstruct", data);
    console.log(result);
    return result;
  } catch (e) {
    console.error(e);
    return { err: e };
  }
};

// 생산 지시건 조회
const getInstructionList = async (query) => {
  try {
    const result = await db.query("selectInstructionList", query);
    return result;
  } catch (e) {
    console.error(e);
    return { err: e };
  }
};

const getDetailInstruction = async (query) => {
  try {
    const result = await db.query("selectDetailInstruction", query);
    return result;
  } catch (e) {
    console.error(e);
    return { err: e };
  }
};

const getStatusZeroProductionList = async () => {
  try {
    const result = await db.query("selectStatusZeroProductionList");
    return result;
  } catch (e) {
    console.log(e);
    return { err: e };
  }
};

const getFacilityListByName = async (fNumber) => {
  try {
    const result = await db.query("selectFacilityListByName", fNumber);
    return result;
  } catch (e) {
    console.log(e);
    return { err: e };
  }
};

const addProdACMSLT = async (data) => {
  try {
    const result = await db.query("insertProdACMSLT", data);
    return result;
  } catch (e) {
    console.log(e);
    return { err: e };
  }
};

module.exports = {
  addProdInstructions,
  getInstructionList,
  getDetailInstruction,
  getStatusZeroProductionList,
  getFacilityListByName,
  addProdACMSLT,
  bomItemList,
};
