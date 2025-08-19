const express = require("express");
const router = express.Router();
const failureTypeService = require("../services/failureTypeService");

router.get("/", async (req, res) => {
  try {
    const rows = await failureTypeService.getAll();
    res.json(rows);
  } catch (err) {
    console.error("Error fetching failure types:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
