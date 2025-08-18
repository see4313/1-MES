// productionRouter.js

const express = require("express");
const router = express.Router();
const itemService = require("../services/itemService");
const productionService = require("../services/productionService");

// getItemList -- 품목 리스트 조회
router.get("/prod/itemlist/:type", async (req, res) => {
  // type = 'notmaterial' : 원재료 빼고 , semi : 반제품, finish : 완제품,
  const { type } = req.params;
  try {
    const result = await itemService.getItemList(type);
    res.send(result);
  } catch (e) {
    console.error(e);
  }
});

// getInstructionList -- 생산 지시 리스트 조회
router.get("/prod/instructionlist", async (req, res) => {
  const { query } = req;
  try {
    const result = await productionService.getInstructionList(query);
    res.send(result);
  } catch (e) {
    console.error(e);
  }
});

// getDetailInstruction -- 세부 지시 조회
router.get("/prod/detailinstruction", async (req, res) => {
  const { query } = req;
  try {
    const result = await productionService.getDetailInstruction(query);
    res.send(result);
  } catch (e) {
    console.error(e);
  }
});

// addProdInstructions -- 생산 지시
router.post("/prod/instructions", async (req, res) => {
  try {
    const { body } = req;
    const result = await productionService.addProdInstructions(body);
    res.send(result);
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
