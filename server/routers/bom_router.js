const express = require("express");
const router = express.Router();
const bomService = require("../services/bom_service");

router.get("/bom", async (req, res) => {
  console.log("[API] GET /api/bom", req.query);
  try {
    const rows = await bomService.listBom(req.query || {});
    res.send(Array.isArray(rows) ? rows : rows?.rows ?? []);
  } catch (err) {
    console.error("[BOM LIST ERROR]", err);
    res.status(500).json({ message: String(err?.message || err) });
  }
});

router.get("/bom/:bomNumber/details", async (req, res) => {
  console.log("[API] GET /api/bom/:bomNumber/details", req.params.bomNumber);
  try {
    const rows = await bomService.getBomDetails(req.params.bomNumber);
    res.send(Array.isArray(rows) ? rows : rows?.rows ?? []);
  } catch (err) {
    console.error("[BOM DETAILS ERROR]", err);
    res.status(500).json({ message: String(err?.message || err) });
  }
});

module.exports = router;
