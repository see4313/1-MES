const express = require("express");
const router = express.Router();
const service = require("../services/repairHistService");

// 전체 조회
router.get("/repairHist", async (req, res) => {
  try {
    const result = await service.getAll();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 등록
router.post("/repairHist", async (req, res) => {
  try {
    const result = await service.create(req.body);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 수정
router.put("/repairHist/:id", async (req, res) => {
  try {
    const result = await service.update(req.params.id, req.body);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 삭제
router.delete("/repairHist/:id", async (req, res) => {
  try {
    const result = await service.remove(req.params.id);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
