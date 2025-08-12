const express = require("express");
const router = express.Router();
const mapper = require("../database/mapper.js");
const bomService = require("../services/bom_service.js");

router.get("/bom", async (req, res) => {
  const list = await bomService.bomList();
  res.json(list);
});

router.get("/bom/:bomNumber/details", async (req, res) => {
  const rows = await bomService.bomDetails(req.params.bomNumber);
  res.json(rows);
});
module.exports = router;
