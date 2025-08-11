// server/routers/vendor_router.js
const express = require("express");
const router = express.Router();
const mapper = require("../database/mapper.js");
const vendorService = require("../services/vendor_service.js");

// 공용 async 에러 핸들러
const asyncH = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// =================== 모달: 거래처 유형 ===================
router.get(
  "/vendorType",
  asyncH(async (req, res) => {
    const q = String(req.query.q ?? "");
    const page = parseInt(req.query.page ?? 1, 10) || 1;
    const size = parseInt(req.query.size ?? 10, 10) || 10;
    const rows = await vendorService.listVendType({ q, page, size });
    res.json(rows);
  })
);

// =================== 모달: 거래처 번호 ===================
router.get(
  "/vendorId",
  asyncH(async (req, res) => {
    const q = String(req.query.q ?? "");
    const page = parseInt(req.query.page ?? 1, 10) || 1;
    const size = parseInt(req.query.size ?? 10, 10) || 10;
    const rows = await vendorService.listVendId({ q, page, size });
    res.json(rows);
  })
);

// =================== 조회 ===================
router.post(
  "/vendor/search",
  asyncH(async (req, res) => {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const rows = await vendorService.listVendor(body);
    res.json(rows);
  })
);

// =================== 등록 ===================
router.post(
  "/vendor",
  asyncH(async (req, res) => {
    const b = (req.body && typeof req.body === "object" ? req.body : {}) ?? {};

    let result;
    try {
      result = await mapper.query(
        "VENDOR.INSERT",
        vendorService.vendorInsertParams(b)
      );
    } catch (e) {
      if (vendorService.isDupError?.(e)) {
        return res.status(409).json({ message: "이미 등록된 거래처입니다!" });
      }
      throw e;
    }

    // 실패했을 가능성에 대비해 재확인
    const verdict = await vendorService.ensureVendorInsertedOr409(b, result);
    if (verdict) return res.status(verdict.status).json(verdict.body);

    res.status(201).json({ ok: true, affectedRows: result?.affectedRows ?? 1 });
  })
);

// =================== 수정 ===================
router.put(
  "/vendor/:id",
  asyncH(async (req, res) => {
    const id = req.params.id;
    const b = (req.body && typeof req.body === "object" ? req.body : {}) ?? {};

    const params = [
      b.vendName ?? "",
      b.bizNumber ?? "",
      b.cntinfo ?? "",
      b.vendType ?? "",
      b.useYn ?? "Y",
      b.address ?? "",
      b.remark ?? "",
      id,
    ];

    const r = await mapper.query("VENDOR.UPDATE", params);
    res.json({ ok: true, affectedRows: r?.affectedRows ?? 0 });
  })
);

// =================== 공용 에러 핸들러 ===================
router.use((err, req, res, _next) => {
  if (vendorService.isDupError?.(err)) {
    return res.status(409).json({ message: "이미 등록된 거래처입니다!" });
  }
  console.error("[VENDOR ROUTER ERROR]", err);
  res.status(500).json({ message: err?.message || "서버 오류" });
});

module.exports = router;
