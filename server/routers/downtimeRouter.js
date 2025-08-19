const express = require("express");
const router = express.Router();
const downtimeService = require("../services/downtimeService");

// 조회
router.get("/downtimeList", async (req, res) => {
  try {
    const rows = await downtimeService.getDowntimeList(req.query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 등록
router.post("/downtimeInsert", async (req, res) => {
  const result = await downtimeService.insertDowntime(req.body);
  res.json(result);
});

// 정정
router.put("/downtimeUpdate", async (req, res) => {
  const result = await downtimeService.updateDowntime(req.body);
  res.json(result);
});

// 무효 처리
router.patch("/downtimeVoid", async (req, res) => {
  const result = await downtimeService.voidDowntime(req.body);
  res.json(result);
});

module.exports = router;
