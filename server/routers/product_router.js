const express = require("express");
const router = express.Router();
// 라우팅 = 사용자의 요청(URI + METHOD) + Service + 응답형태(View or Data)
const productService = require("../services/product_service.js");

// 제품전체조회
router.get("/productList", async (req, res) => {
  const filters = req.query;
  let list = await productService.productList(filters);
  res.send(list); // 응답
});

// 완제품입고등록 목록
router.get("/insertList", async (req, res) => {
  let list = await productService.insertList();
  res.send(list);
});

// 완제품 입고
router.post("/productInsert", async (req, res) => {
  let board = req.body;
  let result = await productService.productInsert(board);
  res.send(result);
});

// 출고관리 목록
router.get("/setDelivery", async (req, res) => {
  let list = await productService.setDelivery();
  res.send(list);
});

// 모달(생산지시)
router.get("/prodModal", async (req, res) => {
  let list = await productService.prodModal();
  res.send(list); // 응답
});

// 가장 마지막에 존재해야 함
module.exports = router;
