const express = require("express");
const router = express.Router();
// 라우팅 = 사용자의 요청(URI + METHOD) + Service + 응답형태(View or Data)
const orderService = require("../services/order_service.js");

// 전체조회
router.get("/orderList", async (req, res) => {
  const filters = req.query;
  let list = await orderService.orderList(filters);
  res.send(list); // 응답
});

// 등록
router.post("/orderInsert", async (req, res) => {
  let board = req.body;
  let result = await orderService.orderInsert(board);
  res.send(result);
});

// 주문상세
router.get("/detailOrder", async (req, res) => {
  const order_id = req.query.order_id;
  let list = await orderService.detailOrder(order_id);
  res.send(list);
});

//주문수정
router.put("/setOrder", async (req, res) => {
  let board = req.body;
  let list = await orderService.setOrder(board);
  res.send(list); // 응답
});

// 상세 단건삭제
router.delete("/deleteOrder", async (req, res) => {
  const { detail_id } = req.body;
  let list = await orderService.deleteOrder(detail_id);
  res.send(list); // 응답
});

// 주문삭제
router.delete("/deleteOrderId", async (req, res) => {
  const { order_id } = req.body;
  let list = await orderService.deleteOrderId(order_id);
  res.send(list); // 응답
});

// 모달(담당자)
router.get("/empModal", async (req, res) => {
  let list = await orderService.empModal();
  res.send(list); // 응답
});

// 모달(주문)
router.get("/orderModal", async (req, res) => {
  let list = await orderService.orderModal();
  res.send(list); // 응답
});

// 모달(상세주문)
router.get("/itemModal1", async (req, res) => {
  let list = await orderService.itemModal1();
  res.send(list); // 응답
});

// 모달(창고주문)
router.get("/whModal", async (req, res) => {
  let list = await orderService.whModal();
  res.send(list); // 응답
});

// 가장 마지막에 존재해야 함
module.exports = router;
