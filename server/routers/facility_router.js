const express = require("express");
const router = express.Router();
const service = require("../services/facility_service.js");

// 설비 목록 조회
router.get("/facilityList", async (req, res) => {
  try {
    const filters = req.query;
    const list = await service.facilityList(filters);
    res.send(list);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// 모달 - 설비명 목록
router.get("/itemNames", async (req, res) => {
  try {
    const list = await service.facilityNames();
    res.send(list);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// 모달 - 설비유형 목록
router.get("/itemTypes", async (req, res) => {
  try {
    const filters = req.query;
    const list = await service.facilityTypes();
    res.send(list);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// 모달 - 담당자 목록
router.get("/users", async (req, res) => {
  try {
    const filters = req.query;
    const list = await service.facilityUsers();
    res.send(list);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
