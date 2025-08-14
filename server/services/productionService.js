// productionService.js
const db = require('../database/mapper');

const addProdInstructions = async (data) => {
  try {
    const result = await db.query('insertProdInstruct', data);
    return result;
  } catch (e) {
    console.error(e);
    return { err : e };
  }
};


// 생산 지시건 조회
const getInstructionList = async () => {
  try {
    const result = await db.query('selectInstructionList');
    return result;
  } catch (e) {
    console.error(e);
    return { err : e };
  }
};

module.exports = {
  addProdInstructions,
  getInstructionList
};