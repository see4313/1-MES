// prcsService.js

const db = require('../database/mapper');

const getPrcs = async () => {
  try {
    const result = await db.query('selectPrcsList');
    return result;
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  getPrcs
};
