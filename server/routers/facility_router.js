// server/routes/facility_router.js
// 사용법(예): app.js에서
//   const facilityRouter = require('./routes/facility_router');
//   app.use('/api/facilities', facilityRouter);

const express = require("express");
const service = require("../services/facility_service.js");

const router = express.Router();

router.get("/facilityList", async (req, res) => {
  const filters = req.query;
  let list = await service.facilityList(filters);
  res.send(list); // 응답
});

// 목록(페이징: ?page=1&size=10)
router.get("/", async (req, res) => {
  try {
    const { page, size } = req.query;
    const data = await service.list({ page, size });
    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res
      .status(err.status || 500)
      .json({ success: false, message: err.message || "Server Error" });
  }
});

// 단건 조회
router.get("/:id", async (req, res) => {
  try {
    const item = await service.getById(req.params.id);
    if (!item)
      return res.status(404).json({ success: false, message: "NOT_FOUND" });
    res.json({ success: true, data: item });
  } catch (err) {
    console.error(err);
    res
      .status(err.status || 500)
      .json({ success: false, message: err.message || "Server Error" });
  }
});

// 등록
router.post("/", async (req, res) => {
  try {
    const created = await service.create(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    console.error(err);
    res
      .status(err.status || 500)
      .json({ success: false, message: err.message || "Server Error" });
  }
});

// 수정
router.put("/:id", async (req, res) => {
  try {
    const updated = await service.update(req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    res
      .status(err.status || 500)
      .json({ success: false, message: err.message || "Server Error" });
  }
});

// 삭제(하드 삭제). 소프트 삭제를 원하면 별도 엔드포인트로 분리 추천
router.delete("/:id", async (req, res) => {
  try {
    const result = await service.remove(req.params.id);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res
      .status(err.status || 500)
      .json({ success: false, message: err.message || "Server Error" });
  }
});

module.exports = router;
