const express = require("express");
const router = express.Router();
// 라우팅 = 사용자의 요청(URI + METHOD) + Service + 응답형태(View or Data)
const materialService = require("../services/material_service.js");

// 재고목록 조회
router.get("/inventoryList", async (req, res) => {
  const filters = req.query;
  let list = await materialService.inventoryList(filters);
  res.send(list); // 응답
});

// 품목목록 조회
router.get("/itemList", async (req, res) => {
  const filters = req.query;
  let list = await materialService.itemList(filters);
  res.send(list); // 응답
});

// 품목번호 조회
router.get("/itemId", async (req, res) => {
  let list = await materialService.itemId();
  res.send(list); // 응답
});

// LOT번호 조회
router.get("/lotId", async (req, res) => {
  let list = await materialService.lotId();
  res.send(list); // 응답
});

// 품목구분 조회
router.get("/itemType", async (req, res) => {
  let list = await materialService.itemtype();
  res.send(list); // 응답
});

// 보관조건 조회
router.get("/cutdCond", async (req, res) => {
  let list = await materialService.cutdCond();
  res.send(list); // 응답
});

// 창고번호 조회
router.get("/whId", async (req, res) => {
  let list = await materialService.whId();
  res.send(list); // 응답
});

// 등록
router.post("/boards", async (req, res) => {
  let board = req.body;
  let result = await boardService.addNew(board);
  res.send(result);
});

// 가장 마지막에 존재해야 함
module.exports = router;
