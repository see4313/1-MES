// productionRouter.js

const express = require("express");
const router = express.Router();
const itemService = require("../services/itemService");
const productionService = require("../services/productionService.js");

// getItemList -- 품목 리스트
router.get("/itemlist/:type", async (req, res) =>{

  // type = 'null' : all, semi : 반제품, finish : 완재품
  const { type } = req.params;
  try {
    const result = await itemService.getItemList(type);
    res.send(result);
  } catch (e) {
    console.error(e);
  }
});

// addProdInstructions -- 생산 지시
router.post("/instructions", async (req, res) => {
  try {
    const { body } = req;
    const result = await productionService.addProdInstructions(body);
    res.send(result);
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
