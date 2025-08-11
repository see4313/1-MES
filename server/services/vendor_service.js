// server/services/vendor_service.js
const mapper = require("../database/mapper.js");

/* =============================
 * 공통 유틸
 * ============================= */

// 문자열 → null 변환
const toNull = (v) => (v === "" || v === undefined || v === null ? null : v);

// null/undefined → 빈 문자열 변환
const nz = (v) => (v === undefined || v === null ? "" : v);

// 숫자 변환 (정수 변환 실패 시 기본값)
const toInt = (v, d = 0) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n >= 0 ? n : d;
};

// limit 변환
const toLimit = (v, d = 50) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n > 0 ? n : d;
};

// MySQL/MariaDB 중복키 에러 식별
const isDupError = (e) => {
  const msg = (e?.sqlMessage || e?.message || "").toLowerCase();
  return (
    e?.code === "ER_DUP_ENTRY" ||
    e?.errno === 1062 ||
    e?.sqlState === "23000" ||
    msg.includes("duplicate entry")
  );
};

/* =============================
 * 모달 조회
 * ============================= */
async function listVendType({ q = "", page = 1, size = 10 }) {
  return await mapper.query("selectVendType", [
    q,
    q,
    q,
    size,
    (page - 1) * size,
  ]);
}

async function listVendId({ q = "", page = 1, size = 10 }) {
  return await mapper.query("selectVendId", [q, q, q, size, (page - 1) * size]);
}

/* =============================
 * 거래처 조회용 파라미터
 * ============================= */
function vendorSearchParams(b = {}, defLimit = 50) {
  return [
    toNull(b.vendId),
    nz(b.vendId),
    toNull(b.vendName),
    nz(b.vendName),
    toNull(b.vendType),
    nz(b.vendType),
  ];
}

// 정확 일치(중복 체크용)
function vendorSearchParamsExactNameBiz({ vendName, bizNumber } = {}) {
  return [toNull(vendName), nz(vendName), toNull(bizNumber), nz(bizNumber)];
}

/* =============================
 * 목록 조회
 * ============================= */
async function listVendor(b = {}) {
  const params = vendorSearchParams(b, b.limit ?? 50);
  const rows = await mapper.query("VENDOR.SEARCH", params);
  const list = Array.isArray(rows) ? rows : rows?.rows ?? [];
  const limit = toLimit(b.limit ?? 50, 50); // SQL에서 LIMIT 제거 시 소프트 제한
  return list.slice(0, limit);
}

/* =============================
 * 등록 후 중복 재확인
 * ============================= */
async function ensureVendorInsertedOr409(b, result) {
  if (result && (result.affectedRows === undefined || result.affectedRows > 0))
    return null;

  const params = vendorSearchParamsExactNameBiz({
    vendName: b.vendName,
    bizNumber: b.bizNumber,
  });

  const dupRows = (await mapper.query("VENDOR.SEARCH_EXACT", params)) || [];
  const isDup =
    Array.isArray(dupRows) &&
    dupRows.some(
      (r) => r.vendName === b.vendName && r.bizNumber === b.bizNumber
    );

  return isDup
    ? { status: 409, body: { message: "이미 등록된 거래처입니다!" } }
    : { status: 500, body: { ok: false, message: "등록 실패" } };
}

module.exports = {
  toNull,
  nz,
  toInt,
  toLimit,
  isDupError,
  listVendType,
  listVendId,
  vendorSearchParams,
  vendorSearchParamsExactNameBiz,
  listVendor,
  ensureVendorInsertedOr409,
};
