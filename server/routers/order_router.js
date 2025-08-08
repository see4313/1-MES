const express = require("express");
const router = express.Router();
// 라우팅 = 사용자의 요청(URI + METHOD) + Service + 응답형태(View or Data)
const orderService = require("../services/order_service.js");

// 전체조회
router.get("/orderList", async (req, res) => {
  let list = await orderService.findAll();
  res.send(list); // 응답
});

// 가장 마지막에 존재해야 함
module.exports = router;
