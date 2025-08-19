const express = require("express");
const router = express.Router();
const svc = require("../services/clean_hist_service");

// 조회: 배열 그대로 반환
router.get("/cleanHistList", async (req, res) => {
  try {
    const { facility_id, emp_id, from_dt, to_dt } = req.query;
    const rows = await svc.listCleanHist({
      facility_id: facility_id || null,
      emp_id: emp_id || null,
      from_dt: from_dt || null, // 'YYYY-MM-DD HH:mm:ss'
      to_dt: to_dt || null, // 'YYYY-MM-DD HH:mm:ss'
    });
    res.json(rows);
  } catch (err) {
    console.error("[cleanHistList] error:", err);
    res.status(500).json([]);
  }
});

// 등록
router.post("/cleanHistInsert", async (req, res) => {
  try {
    const { facility_id, emp_id, clean_start_dt, clean_end_dt, remk } =
      req.body || {};
    const miss = [
      "facility_id",
      "emp_id",
      "clean_start_dt",
      "clean_end_dt",
    ].filter((k) => !req.body?.[k]);
    if (miss.length)
      return res
        .status(400)
        .json({ success: false, error: `필수값 누락: ${miss.join(", ")}` });

    if (new Date(clean_end_dt) < new Date(clean_start_dt)) {
      return res
        .status(400)
        .json({ success: false, error: "종료일시는 시작일시 이후여야 합니다" });
    }

    const insertId = await svc.insertCleanHist({
      facility_id,
      emp_id,
      clean_start_dt,
      clean_end_dt,
      remk,
    });
    res.json({ success: true, insertId });
  } catch (err) {
    console.error("[cleanHistInsert] error:", err);
    res.status(500).json({ success: false, error: "등록 실패" });
  }
});

// 정정(수정)
router.put("/cleanHistUpdate", async (req, res) => {
  try {
    const { hist_id, facility_id, emp_id, clean_start_dt, clean_end_dt, remk } =
      req.body || {};
    if (!hist_id)
      return res.status(400).json({ success: false, error: "hist_id 누락" });

    if (
      clean_start_dt &&
      clean_end_dt &&
      new Date(clean_end_dt) < new Date(clean_start_dt)
    ) {
      return res
        .status(400)
        .json({ success: false, error: "종료일시는 시작일시 이후여야 합니다" });
    }

    const ok = await svc.updateCleanHist({
      hist_id,
      facility_id,
      emp_id,
      clean_start_dt,
      clean_end_dt,
      remk,
    });
    res.json({ success: !!ok });
  } catch (err) {
    console.error("[cleanHistUpdate] error:", err);
    res.status(500).json({ success: false, error: "수정 실패" });
  }
});

// 무효 처리
router.patch("/cleanHistVoid", async (req, res) => {
  try {
    const { hist_id } = req.body || {};
    if (!hist_id)
      return res.status(400).json({ success: false, error: "hist_id 누락" });

    const ok = await svc.voidCleanHist(hist_id || null);
    res.json({ success: !!ok });
  } catch (err) {
    console.error("[cleanHistVoid] error:", err);
    res.status(500).json({ success: false, error: "무효 처리 실패" });
  }
});

module.exports = router;
