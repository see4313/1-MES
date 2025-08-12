const express = require("express");
const router = express.Router();
const { getBadnCode } = require("../services/badncodeService.js");

router.get("/badncode", async (req, res) => {
  try {
    const data = await getBadnCode();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "DB 조회 실패" });
  }
});

module.exports = router;
