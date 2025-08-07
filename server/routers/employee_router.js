const express = require("express");
const router = express.Router();
// 라우팅 = 사용자의 요청(URI + METHOD) + Service + 응답형태(View or Data)
const basicService = require("../services/basic_service.js");

router.get("/emp/search", async (req, res) => {
  const filters = req.query; // 넘어온 값만 사용
  const list = await basicService.findByFilters(filters);
  res.send(list);
});

module.exports = router;
