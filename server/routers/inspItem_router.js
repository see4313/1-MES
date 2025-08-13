const express = require("express");
const router = express.Router();
const {
  getInspItems,
  createInspItem,
  updateInspItem,
  deleteInspItem,
} = require("../services/inspItemService.js");

router.get("/inspitem", async (req, res) => {
  try {
    const data = await getInspItems();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB 조회 실패" });
  }
});

router.post("/inspitem", async (req, res) => {
  try {
    await createInspItem(req.body || {});
    res.status(201).json({});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB 저장 실패" });
  }
});

router.put("/inspitem/:id", async (req, res) => {
  try {
    const affected = await updateInspItem(req.params.id, req.body || {});
    if (!affected) return res.status(404).json({ message: "대상이 없습니다" });
    res.json({ affected });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB 수정 실패" });
  }
});

router.delete("/inspitem/:id", async (req, res) => {
  try {
    const affected = await deleteInspItem(req.params.id);
    if (!affected) return res.status(404).json({ message: "대상이 없습니다" });
    res.json({ affected });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB 삭제 실패" });
  }
});

module.exports = router;
