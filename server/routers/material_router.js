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

// 출고이력 조회
router.get("/historyList", async (req, res) => {
  const filters = req.query;
  let list = await materialService.historyList(filters);
  res.send(list); // 응답
});

// 품목목록 조회
router.get("/itemList", async (req, res) => {
  const filters = req.query;
  let list = await materialService.itemList(filters);
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

// 단위 조회
router.get("/itemUnit", async (req, res) => {
  let list = await materialService.itemUnit();
  res.send(list); // 응답
});

// 거래처 조회
router.get("/selectVend", async (req, res) => {
  let list = await materialService.selectVend();
  res.send(list); // 응답
});

// 사원 조회
router.get("/selectEmp", async (req, res) => {
  let list = await materialService.selectEmp();
  res.send(list); // 응답
});

// 품목 삭제
router.delete("/itemDelete", async (req, res) => {
  const { item_id } = req.body;
  let result = await materialService.deleteItem(item_id);
  res.send(result);
});

// 품목 수정
router.put("/itemUpdate", async (req, res) => {
  let item = req.body;
  let result = await materialService.modifyItem(item);
  res.send(result);
});

// 품목 등록
router.post("/itemInsert", async (req, res) => {
  let item = req.body;
  let result = await materialService.addItem(item);
  res.send(result);
});

// 발주 등록
router.post("/procInsert", async (req, res) => {
  let item = req.body;
  let result = await materialService.procInsert(item);
  res.send(result);
});

// 발주 조회
router.get("/selectProc", async (req, res) => {
  let params = req.query.regist_date;
  let list = await materialService.selectProc(params);
  res.send(list); // 응답
});

// 발주 상세
router.get("/selectProcDetail", async (req, res) => {
  let params = req.query.procId;
  let list = await materialService.selectProcDetail(params);
  res.send(list); // 응답
});

// 입고 처리
router.post("/receive", async (req, res) => {
  let item = req.body;
  let result = await materialService.receive(item);
  res.send(result);
});

// 반품 처리
router.post("/itemReturn", async (req, res) => {
  let item = req.body;
  let result = await materialService.itemReturn(item);
  res.send(result);
});

// 폐기 처리
router.post("/itemdispose", async (req, res) => {
  let item = req.body;
  let result = await materialService.itemdispose(item);
  res.send(result);
});

// 가장 마지막에 존재해야 함
module.exports = router;
