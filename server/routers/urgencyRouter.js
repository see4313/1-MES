// routers/urgencyRouter.js
const express = require("express");
const router = express.Router();
const mapper = require("../database/mapper.js");

// 긴급도 전체 조회
router.get("/urgency/list", async (req, res) => {
  try {
    const rows = await mapper.query("selectUrgencyList");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "긴급도 조회 실패" });
  }
});

module.exports = router;
