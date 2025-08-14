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

// 설비 등록
router.post("/facilityInsert", async (req, res) => {
  try {
    const result = await service.facilityInsert(req.body);
    res.send({ success: true, result });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "등록 실패" });
  }
});

// 설비 수정
router.put("/facilityUpdate", async (req, res) => {
  try {
    console.log(req.body);
    const result = await service.facilityUpdate(req.body);
    res.send({ success: true, result });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "수정 실패" });
  }
});

// 설비 삭제
router.delete("/facilityDelete", async (req, res) => {
  try {
    const result = await service.facilityDelete(req.body.facility_id);
    res.send({ success: true, result });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "삭제 실패" });
  }
});

module.exports = router;
