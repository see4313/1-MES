const express = require("express");
const router = express.Router();
// 라우팅 = 사용자의 요청(URI + METHOD) + Service + 응답형태(View or Data)
const materialService = require("../services/material_service.js");

// 전체조회
router.get("/inventoryList", async (req, res) => {
  const filters = req.query;
  let list = await materialService.inventoryList(filters);
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
