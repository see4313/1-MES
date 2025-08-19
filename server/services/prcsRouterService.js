// prcsRouterService.js
const db = require("../database/mapper");

const getPrcsRouterList = async () => {
  try {
    const result = await db.query("selectPrcsRouterList");
    return result;
  } catch (e) {
    console.error(e);
    return { err: e };
  }
};

const getPrcsRouter = async (query) => {
  try {
    const result = await db.query("selectPrcsRouter", query);
    return result;
  } catch (e) {
    console.error(e);
    return { err: e };
  }
};

const savePrcsRouter = async (data) => {
  try {
    const result = await db.query("savePrcsRouter", data);
    return result;
  } catch (e) {
    console.error(e);
    return { err: e };
  }
}

module.exports = { 
  getPrcsRouterList, 
  getPrcsRouter,
  savePrcsRouter
};