// server/routers/vendor_router.js
const express = require("express");
const router = express.Router();
const mapper = require("../database/mapper.js");
const vendorService = require("../services/vendor_service.js");

// 공용 async 에러 핸들러
const asyncH = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ========== 모달: 거래처 유형 ========== */
router.get(
  "/vendorType",
  asyncH(async (req, res) => {
    const q = String(req.query.q ?? "");
    const page = parseInt(req.query.page ?? 1, 10) || 1;
    const size = parseInt(req.query.size ?? 10, 10) || 10;
    const rows = await vendorService.listVendType({ q, page, size });
    res.json(Array.isArray(rows) ? rows : rows?.rows ?? []);
  })
);

/* ========== 모달: 거래처 번호 ========== */
router.get(
  "/vendorId",
  asyncH(async (req, res) => {
    const q = String(req.query.q ?? "");
    const page = parseInt(req.query.page ?? 1, 10) || 1;
    const size = parseInt(req.query.size ?? 10, 10) || 10;
    const rows = await vendorService.listVendId({ q, page, size });
    res.json(Array.isArray(rows) ? rows : rows?.rows ?? []);
  })
);

/* ========== 모달: 담당자(사원) ========== */
router.get(
  "/vendorPsch",
  asyncH(async (req, res) => {
    const q = String(req.query.q ?? "");
    const page = parseInt(req.query.page ?? 1, 10) || 1;
    const size = parseInt(req.query.size ?? 10, 10) || 10;
    const rows = await vendorService.listVendPsch({ q, page, size });
    res.json(Array.isArray(rows) ? rows : rows?.rows ?? []);
  })
);

/* ========== 조회 ========== */
router.post(
  "/vendor/search",
  asyncH(async (req, res) => {
    const rows = await vendorService.listVendor(req.body || {});
    res.json(Array.isArray(rows) ? rows : rows?.rows ?? []);
  })
);

/* ========== 등록 ========== */
router.post(
  "/vendor",
  asyncH(async (req, res) => {
    const b = req.body ?? {};
    console.log("[POST /api/vendor] payload:", b);

    // 사전 중복 검사(거래처명+사업자번호 정확 일치)
    const exact = await mapper.query("VENDOR.SEARCH_EXACT", [
      vendorService.toNull(b.vendName),
      vendorService.nz(b.vendName),
      vendorService.toNull(b.bizNumber),
      vendorService.nz(b.bizNumber),
    ]);
    const dup = (Array.isArray(exact) ? exact : exact?.rows ?? []).some(
      (r) => r.vendName === b.vendName && r.bizNumber === b.bizNumber
    );
    if (dup)
      return res.status(409).json({ message: "이미 등록된 거래처입니다!" });

    const params = vendorService.vendorInsertParams(b);
    const result = await mapper.query("VENDOR.INSERT", params);
    res.status(201).json({ ok: true, affectedRows: result?.affectedRows ?? 1 });
  })
);

/* ========== 수정 ========== */
router.put(
  "/vendor/:id",
  asyncH(async (req, res) => {
    const id = req.params.id;
    const params = vendorService.vendorUpdateParams(req.body || {}, id);
    const r = await mapper.query("VENDOR.UPDATE", params);
    res.json({ ok: true, affectedRows: r?.affectedRows ?? 0 });
  })
);

/* ========== 공용 에러 핸들러 ========== */
router.use((err, req, res, _next) => {
  if (vendorService.isDupError?.(err)) {
    return res.status(409).json({ message: "이미 등록된 거래처입니다!" });
  }
  console.error("[VENDOR ROUTER ERROR]", err);
  res
    .status(500)
    .json({ message: err?.sqlMessage || err?.message || "서버 오류" });
});

module.exports = router;
