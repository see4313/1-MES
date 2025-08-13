// server/routers/bom_router.js
const express = require("express");
const router = express.Router();
const bomService = require("../services/bom_service");

// 목록
router.get("/bom", async (req, res) => {
  console.log("[API] GET /bom", Object.assign({}, req.query));
  try {
    const rows = await bomService.listBom(req.query || {});
    res.set("Cache-Control", "no-store");
    res.status(200).json(Array.isArray(rows) ? rows : []);
  } catch (err) {
    console.error("[BOM LIST ERROR]", err);
    res.status(500).json({ message: String(err?.message || err) });
  }
});

// 상세
router.get("/bom/:bomNumber/details", async (req, res) => {
  console.log("[API] GET /bom/:bomNumber/details", req.params.bomNumber);
  try {
    const rows = await bomService.getBomDetails(req.params.bomNumber);
    res.set("Cache-Control", "no-store");
    res.status(200).json(Array.isArray(rows) ? rows : []);
  } catch (err) {
    console.error("[BOM DETAILS ERROR]", err);
    res.status(500).json({ message: String(err?.message || err) });
  }
});

router.get("/item", async (req, res) => {
  try {
    const { item_name } = req.query;
    const items = await itemService.getItems({ item_name });
    res.status(200).json(items);
  } catch (err) {
    console.error("[ITEM LIST ERROR]", err);
    res.status(500).json({ message: "품목 목록 조회 오류" });
  }
});

module.exports = router;
