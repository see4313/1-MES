const express = require("express");
const router = express.Router();
const inspectHistService = require("../services/inspectHistService.js");
console.log("inspectHistService = ", inspectHistService);
// 점검이력 조회
router.get("/inspectHist", async (req, res) => {
  try {
    const filters = {
      facility_nm: req.query.facility_nm,
      emp_nm: req.query.emp_nm,
      inspect_item: req.query.inspect_item,
      start_dt: req.query.start_dt,
      end_dt: req.query.end_dt,
    };
    const result = await inspectHistService.list(filters);
    res.json(result);
  } catch (err) {
    console.error("inspectHist list error:", err);
    res.status(500).json({ error: "조회 실패" });
  }
});

// 점검이력 등록
router.post("/inspectHist", async (req, res) => {
  try {
    const result = await inspectHistService.insert(req.body);
    res.json({ message: "등록 성공", result });
  } catch (err) {
    console.error("inspectHist insert error:", err);
    res.status(500).json({ error: "등록 실패" });
  }
});

// 점검이력 수정
router.put("/inspectHist/:id", async (req, res) => {
  try {
    const data = { ...req.body, inspect_hist_id: req.params.id };
    const result = await inspectHistService.update(data);
    res.json({ message: "수정 성공", result });
  } catch (err) {
    console.error("inspectHist update error:", err);
    res.status(500).json({ error: "수정 실패" });
  }
});

// 점검이력 삭제
router.delete("/inspectHist/:id", async (req, res) => {
  try {
    const result = await inspectHistService.delete(req.params.id);
    res.json({ message: "삭제 성공", result });
  } catch (err) {
    console.error("inspectHist delete error:", err);
    res.status(500).json({ error: "삭제 실패" });
  }
});

module.exports = router;
