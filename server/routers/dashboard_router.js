const express = require("express");
const router = express.Router();
const dashboardService = require("../services/dashboard_service.js");

// 요약 통계
router.get("/api/dashboard/summary", async (req, res) => {
  try {
    const result = await dashboardService.getSummary();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "summary 조회 실패" });
  }
});

// 고장/수리 현황
router.get("/api/dashboard/failures", async (req, res) => {
  try {
    const result = await dashboardService.getFailures();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failures 조회 실패" });
  }
});

// 예정 작업
router.get("/api/dashboard/upcoming", async (req, res) => {
  try {
    const result = await dashboardService.getUpcoming();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "upcoming 조회 실패" });
  }
});

module.exports = router;
