// server/routes/bom.js
const express = require("express");
const router = express.Router();
const bomService = require("../services/bom_service");

/* ---------- 공통 ---------- */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
const asArray = (v) => (Array.isArray(v) ? v : []);

// GET 캐시 방지
router.use((req, res, next) => {
  if (req.method === "GET") res.set("Cache-Control", "no-store");
  next();
});

/* ---------- 조회 ---------- */
// BOM 목록
router.get(
  "/bom",
  asyncHandler(async (req, res) => {
    const rows = await bomService.listBom(req.query || {});
    res.json(asArray(rows));
  })
);

// BOM 상세(디테일)
router.get(
  "/bom/:bomNumber/details",
  asyncHandler(async (req, res) => {
    const rows = await bomService.getBomDetails(req.params.bomNumber);
    res.json(asArray(rows));
  })
);

// 품목 모달용
router.get(
  "/item",
  asyncHandler(async (_req, res) => {
    const items = await bomService.itemModal();
    res.json(asArray(items));
  })
);

// 다음 버전 라벨("verN")
router.get(
  "/bom/maxVersion",
  asyncHandler(async (req, res) => {
    const { itemId } = req.query || {};
    if (!itemId)
      return res.status(400).json({ message: "itemId는 필수입니다." });
    const ver = await bomService.nextVerLabelByItemId(itemId);
    res.json({ ver });
  })
);

/* ---------- 저장 ---------- */
// 업서트: 같은 품목 있으면 최신 BOM을 '제자리 버전업 + 상세 upsert', 없으면 신규 생성
router.post(
  "/bom",
  asyncHandler(async (req, res) => {
    const { header, details } = req.body || {};
    if (!header)
      return res.status(400).json({ message: "header는 필수입니다." });
    if (details !== undefined && !Array.isArray(details)) {
      return res.status(400).json({ message: "details는 배열이어야 합니다." });
    }
    const out = await bomService.upsertBomByItem({
      header,
      details: details ?? [],
    });
    res.json(out); // { bom_number, ver? }
  })
);
//수정
router.put(
  "/bom/:bomNumber",
  asyncHandler(async (req, res) => {
    const { bomNumber } = req.params;
    try {
      const out = await bomService.updateBomHeader(bomNumber, req.body || {});
      if (out.updated) {
        return res.json({
          message: "BOM 헤더 수정 완료",
          bom_number: bomNumber,
        });
      }
      return res.status(404).json({ message: "수정 대상이 없습니다." });
    } catch (err) {
      if (err?.status) return res.status(err.status).json(err.body);
      return res.status(500).json({ message: err?.message || "서버 오류" });
    }
  })
);

// 기존 BOM을 '제자리'에서 버전업 + 상세 upsert
router.post(
  "/bom/:bomNumber/version-up-inplace",
  asyncHandler(async (req, res) => {
    const { bomNumber } = req.params;
    const { header, details } = req.body || {};
    if (!bomNumber)
      return res.status(400).json({ message: "bomNumber가 필요합니다." });
    if (!Array.isArray(details) || details.length === 0) {
      return res
        .status(400)
        .json({ message: "details는 1개 이상 필요합니다." });
    }
    const out = await bomService.versionUpInPlace(
      bomNumber,
      details,
      header || {}
    );
    res.json(out); // { bom_number, ver }
  })
);
//버전유지
router.post(
  "/bom/:bomNumber/details",
  asyncHandler(async (req, res) => {
    const { bomNumber } = req.params;
    const { details } = req.body || {};
    if (!bomNumber)
      return res.status(400).json({ message: "bomNumber가 필요합니다." });
    if (!Array.isArray(details) || details.length === 0) {
      return res
        .status(400)
        .json({ message: "details는 1개 이상 필요합니다." });
    }
    const out = await bomService.upsertBomDetailsOnly(bomNumber, details);
    // { bom_number, detail_rows }
    res.json({ ok: true, ...out });
  })
);

/* ---------- 삭제 ---------- */
// 상세 한 행 삭제
router.delete(
  "/bom/:bomNumber/details/:detailCode",
  asyncHandler(async (req, res) => {
    const { bomNumber, detailCode } = req.params;
    if (!bomNumber || !detailCode)
      return res.status(400).json({ message: "파라미터 누락" });
    const r = await bomService.deleteBomDetail(bomNumber, detailCode);
    return r.deleted
      ? res.json({ message: "삭제 완료" })
      : res.status(404).json({ message: "삭제 대상 없음" });
  })
);

// BOM 전체 삭제
router.delete(
  "/bom/:bomNumber",
  asyncHandler(async (req, res) => {
    const { bomNumber } = req.params;
    const result = await bomService.deleteBom(bomNumber);
    if (result.deleted) res.json({ message: "BOM 삭제 완료" });
    else res.status(404).json({ message: "삭제 대상이 없습니다." });
  })
);

module.exports = router;
