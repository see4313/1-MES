const express = require("express");
const router = express.Router();
const {
  getBadnCode,
  insertBadnCode,
} = require("../services/badncodeService.js");

// 조회
router.get("/badncode", async (req, res) => {
  try {
    const data = await getBadnCode();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "DB 조회 실패" });
  }
});

// 등록
router.post("/badncode", async (req, res) => {
  try {
    let badn = req.body;
    let result = await insertBadnCode(badn);
    res.send(result);
  } catch (err) {
    res.status(500).json({ message: "DB 저장 실패" });
  }
});

module.exports = router;
