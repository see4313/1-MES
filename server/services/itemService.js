// itemService.js
const db = require('../database/mapper');

const getItemList = async (type) => {
  try {
    const result = await db.query('selectItemList', type);
    return result;
  } catch (e) {
    console.error(e);
  }
};

const getPrcsItemList = async (type) => {
  try {
    const result = await db.query('selectPrcsItemList', type);
    return result;
  } catch (e) {
    console.error(e);
  }
};

const getItemListNoRegisteredPrcsRouting = async () => {
    try {
    const result = await db.query('selectItemListNoRegisteredPrcsRouting');
    return result;
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  getItemList,
  getPrcsItemList,
  getItemListNoRegisteredPrcsRouting
};
