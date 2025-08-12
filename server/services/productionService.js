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

module.exports = {
  addProdInstructions
};