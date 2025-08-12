const express = require("express");
const router = express.Router();
const { getInspItems } = require("../services/inspItemService.js");

router.get("/inspitem", async (req, res) => {
  try {
    const data = await getInspItems();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "DB 조회 실패" });
  }
});

module.exports = router;
