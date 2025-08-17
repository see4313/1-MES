const express = require("express");
const router = express.Router();
const bomService = require("../services/bom_service");

/* ================ 공통 유틸 ================ */
// 비동기 에러 핸들링 래퍼
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// GET 요청들은 캐시 방지
router.use((req, res, next) => {
  if (req.method === "GET") res.set("Cache-Control", "no-store");
  next();
});

// 배열 응답 보정 (GET 목록/상세 공용)
const asArray = (data) => (Array.isArray(data) ? data : []);

/* ================ BOM 목록 조회 ================ */
// GET /bom?filters...
router.get(
  "/bom",
  asyncHandler(async (req, res) => {
    console.log("[API] GET /bom", { ...req.query });
    const rows = await bomService.listBom(req.query || {});
    res.status(200).json(asArray(rows));
  })
);

/* ================ BOM 상세 조회 ================ */
// GET /bom/:bomNumber/details
router.get(
  "/bom/:bomNumber/details",
  asyncHandler(async (req, res) => {
    const rows = await bomService.getBomDetails(req.params.bomNumber);
    res.status(200).json(asArray(rows));
  })
);

/* ================ 품목 모달 조회 ================ */
// GET /item
router.get(
  "/item",
  asyncHandler(async (_req, res) => {
    const items = await bomService.itemModal();
    res.status(200).json(asArray(items));
  })
);

/* ================ BOM 상세 삭제 ================ */
// DELETE /bom/:bomNumber/details/:bomDetailNo
router.delete(
  "/bom/:bomNumber/details/:bomDetailNo",
  asyncHandler(async (req, res) => {
    const { bomNumber, bomDetailNo } = req.params;
    const result = await bomService.deleteBomDetail(bomNumber, bomDetailNo);
    res.status(200).json({
      message: "BOM 상세 내역이 성공적으로 삭제되었습니다.",
      result,
    });
  })
);

/* ================ BOM 헤더 등록/수정 ================ */
// POST /bomInsert  (헤더 등록)
router.post(
  "/bomInsert",
  asyncHandler(async (req, res) => {
    try {
      const out = await bomService.insertBomHeader(req.body || {});
      res.status(200).json(out);
    } catch (err) {
      if (err.status)
        return res
          .status(err.status)
          .json(err.body || { message: err.message });
      res.status(500).json({ message: err.message || "등록 실패" });
    }
  })
);

// PUT /bom/:bomNumber  (헤더 수정)
router.put(
  "/bom/:bomNumber",
  asyncHandler(async (req, res) => {
    try {
      const out = await bomService.updateBomHeader(
        req.params.bomNumber,
        req.body || {}
      );
      res.status(200).json(out);
    } catch (err) {
      if (err.status)
        return res
          .status(err.status)
          .json(err.body || { message: err.message });
      res.status(500).json({ message: err.message || "수정 실패" });
    }
  })
);

/* ================ 저장(프로시저) ================ */
// POST /bom  (신규: 헤더 필수, 디테일 옵션)
router.post(
  "/bom",
  asyncHandler(async (req, res) => {
    const { header, details } = req.body || {};
    if (!header)
      return res.status(400).json({ message: "header는 필수입니다." });

    const out = await bomService.saveBomViaProc({
      bomNumber: null,
      header,
      details: details ?? [],
    });
    res.status(200).json(out); // { bom_number, detail_rows }
  })
);

// POST /bom/:bomNumber/details  (기존 BOM 디테일 추가/수정)
router.post(
  "/bom/:bomNumber/details",
  asyncHandler(async (req, res) => {
    const { bomNumber } = req.params;
    const { details } = req.body || {};

    if (!bomNumber)
      return res.status(400).json({ message: "bomNumber가 필요합니다." });
    if (!Array.isArray(details))
      return res
        .status(400)
        .json({ message: "details는 배열 형태여야 합니다." });

    const out = await bomService.saveBomViaProc({
      bomNumber,
      header: null, // 헤더 변경 없음
      details, // 빈 배열도 허용(전체 삭제 시나리오)
    });
    res.status(200).json(out); // { bom_number, detail_rows }
  })
);

module.exports = router;
