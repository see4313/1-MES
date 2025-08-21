// productionRouter.js

const express = require("express");
const router = express.Router();
const itemService = require("../services/itemService");
const productionService = require("../services/productionService");
const prcsRouterService = require("../services/prcsRouterService");
const prcsServive = require("../services/prcsService")

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

// getItemList -- 품목 리스트 조회
router.get("/prod/prcsitemlist/:type", async (req, res) => {
  // type = 'notmaterial' : 원재료 빼고 , semi : 반제품, finish : 완제품,
  const { type } = req.params;
  try {
    const result = await itemService.getPrcsItemList(type);
    res.send(result);
  } catch (e) {
    console.error(e);
  }
});

// 공정흐름도 미등록 품목 리스트 조회
router.get("/prod/noprcsrouteritemlist", async (req, res) => {
  try {
    const result = await itemService.getItemListNoRegisteredPrcsRouting();
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
  const { body } = req;
  try {
    const result = await productionService.addProdInstructions(body);
    res.send(result);
  } catch (e) {
    console.error(e);
  }
});

// getPrcsRouterList -- 공정흐름도 리스트 조회
router.get("/prod/prcsrouterlist", async (req, res) => {
  try {
    const result = await prcsRouterService.getPrcsRouterList();
    res.send(result);
  } catch (e) {
    console.error(e);
  }
});

// getPrcsRouter -- 공정흐름도 리스트 조회
router.get("/prod/prcsrouter", async (req, res) => {
  const { query } = req;
  console.log(query)
  try {
    const result = await prcsRouterService.getPrcsRouter(query);
    res.send(result);
  } catch (e) {
    console.error(e);
  }
});

//getPrcs -- 공정리스트 조회
router.get("/prod/prcslist", async (req, res) => {
  try {
    const result = await prcsServive.getPrcs();
    res.send(result);
  } catch (e) {
    console.error(e);
  }
})

// addPrcsRouter -- 공정흐름도 CRUD
router.post("/prod/saveprcsrouter", async (req, res) => {
  const { body } = req;
  try {
    const result = await prcsRouterService.savePrcsRouter(body);
    res.send(result);
  } catch (e) {
    console.error(e);
  }
});

// getStatusZeroProductionList -- 생산 번호 가져오기
router.get("/prod/getstatuszeroprodlist", async (req, res) => {
  try {
    const result = await productionService.getStatusZeroProductionList();
    res.send(result);
  } catch (e) {
    console.error(e);
  }
})

// getFacilityByName -- 현재 공정의 설비 가져오기
router.get('/prod/getfacilitybyname/:fNumber', async (req, res) => {
  const { fNumber } = req.params;
  try {
    const result = await productionService.getFacilityListByName(fNumber);
    res.send(result);
  } catch (e) {
    console.error(e);
  }
});

// addProdACMSLT -- 생산 실적 등록
router.post('/prod/addprodacmslt', async (req, res) => {
  const { body } = req;
  try {
    const result = await productionService.addProdACMSLT(body);
    res.send(result);
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
