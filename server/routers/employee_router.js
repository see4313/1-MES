// server/routers/employee_router.js
const express = require("express");
const router = express.Router();
const mapper = require("../database/mapper.js");
const {
  pagedQuery,
  empSearchParams,
  empInsertParams,
  ensureInsertedOr409,
  isDupError,
} = require("../services/employee_service.js");
const empService = require("../services/employee_service.js");

//  async 핸들러
const asyncH = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

//  배열만 꺼내기
const rowsOnly = (r) => (Array.isArray(r) ? r : r?.rows ?? []);

// ===== 모달 소스 =====
router.get(
  "/status",
  asyncH(async (req, res) => {
    const { page, size } = req.query;
    res.json(await pagedQuery("selectStatus", page, size));
  })
);

router.get(
  "/perm",
  asyncH(async (req, res) => {
    const { page, size } = req.query;
    res.json(await pagedQuery("selectPerm", page, size));
  })
);

router.get(
  "/dept",
  asyncH(async (req, res) => {
    const { page, size } = req.query;
    res.json(await pagedQuery("selectDept", page, size));
  })
);

// ===== 사원 조회 =====
router.post(
  "/emp/search",
  asyncH(async (req, res) => {
    const rows = await mapper.query(
      "EMP.SEARCH",
      empSearchParams(req.body || {})
    );
    res.json(rowsOnly(rows));
  })
);

// ===== 사원 등록 =====
router.post(
  "/emp",
  asyncH(async (req, res) => {
    const b = req.body ?? {};
    try {
      const result = await mapper.query("EMP.INSERT", empInsertParams(b));
      // 이중확인
      const verdict = await ensureInsertedOr409(b, result);
      if (verdict) return res.status(verdict.status).json(verdict.body);
      return res
        .status(201)
        .json({ ok: true, affectedRows: result?.affectedRows ?? 1 });
    } catch (e) {
      if (isDupError(e))
        return res.status(409).json({ message: "이미 등록된 사원입니다!" });
      throw e;
    }
  })
);

// ===== 사원 수정 =====
router.put(
  "/emp/:id",
  asyncH(async (req, res) => {
    const id = req.params.id;
    const {
      name = "",
      dept = "",
      phone = "",
      joinDate = null,
      leavDate = null,
      status = "",
      permName = "",
      remark = "",
    } = req.body || {};

    const params = [
      name,
      dept,
      phone,
      joinDate,
      leavDate,
      status,
      permName,
      remark,
      id,
    ];
    const r = await mapper.query("EMP.UPDATE", params);
    res.json({ ok: true, affectedRows: r?.affectedRows ?? 0 });
  })
);

// 사원 삭제
router.delete("/empDelete", async (req, res) => {
  const { emp_id } = req.body;
  let result = await empService.deleteEmp(emp_id);
  res.send(result);
});

// ===== 공용 에러 핸들러 =====
router.use((err, _req, res, _next) => {
  if (isDupError(err))
    return res.status(409).json({ message: "이미 등록된 사원입니다!" });
  console.error("[EMP ROUTER ERROR]", err);
  res.status(500).json({ message: err?.message || "서버 오류" });
});

module.exports = router;
