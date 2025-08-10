const express = require("express");
const router = express.Router();
// 라우팅 = 사용자의 요청(URI + METHOD) + Service + 응답형태(View or Data)
const vendService = require("../services/vend_service.js");

// 전체조회
router.get("/vend", async (req, res) => {
  let list = await vendService.findAll();
  res.send(list); // 응답
});

// 가장 마지막에 존재해야 함
module.exports = router;
