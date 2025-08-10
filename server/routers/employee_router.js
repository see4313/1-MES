const express = require("express");
const router = express.Router();
const mapper = require("../database/mapper.js");
const empService = require("../services/employee_service.js");

// async 에러 핸들러
const asyncH = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// 상태 목록
router.get(
  "/status",
  asyncH(async (req, res) => {
    const { page, size } = req.query;
    res.json(await empService.pagedQuery("selectStatus", page, size));
  })
);

// 권한 목록
router.get(
  "/perm",
  asyncH(async (req, res) => {
    const { page, size } = req.query;
    res.json(await empService.pagedQuery("selectPerm", page, size));
  })
);

// 부서 목록
router.get(
  "/dept",
  asyncH(async (req, res) => {
    const { page, size } = req.query;
    res.json(await empService.pagedQuery("selectDept", page, size));
  })
);

// 사원 조회
router.post(
  "/emp/search",
  asyncH(async (req, res) => {
    const rows = await mapper.query(
      "EMP.SEARCH",
      empService.empSearchParams(req.body)
    );
    res.json(Array.isArray(rows) ? rows : rows?.rows ?? []);
  })
);

// 사원 등록
router.post(
  "/emp",
  asyncH(async (req, res) => {
    const b = req.body ?? {};

    // INSERT 시도
    let result;
    try {
      result = await mapper.query("EMP.INSERT", empService.empInsertParams(b));
    } catch (e) {
      if (empService.isDupError(e)) {
        return res.status(409).json({ message: "이미 등록된 사원입니다!" });
      }
      throw e;
    }

    // 중복 재확인
    const verdict = await empService.ensureInsertedOr409(b, result);
    if (verdict) return res.status(verdict.status).json(verdict.body);

    res.status(201).json({ ok: true, affectedRows: result?.affectedRows ?? 1 });
  })
);

// 사원 수정
router.put(
  "/emp/:id",
  asyncH(async (req, res) => {
    const id = req.params.id;
    const b = req.body || {};
    const params = [
      b.name ?? "",
      b.dept ?? "",
      b.phone ?? "",
      b.joinDate ?? null,
      b.leavDate ?? null,
      b.status ?? "",
      b.permName ?? "",
      b.remark ?? "",
      id,
    ];
    const r = await mapper.query("EMP.UPDATE", params);
    res.json({ ok: true, affectedRows: r?.affectedRows ?? 0 });
  })
);

// 에러 핸들러
router.use((err, req, res, _next) => {
  if (empService.isDupError(err)) {
    return res.status(409).json({ message: "이미 등록된 사원입니다!" });
  }
  console.error("[EMP ROUTER ERROR]", err);
  res.status(500).json({ message: "서버 오류" });
});

module.exports = router;
