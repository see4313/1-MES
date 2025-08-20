// server/services/vendor_service.js
const mapper = require("../database/mapper.js");

/* ===== 유틸 ===== */
const toNull = (v) => (v === "" || v === undefined || v === null ? null : v);
const nz = (v) => (v === undefined || v === null ? "" : v);
const toInt = (v, d = 0) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n >= 0 ? n : d;
};
const isDupError = (e) => {
  const msg = (e?.sqlMessage || e?.message || "").toLowerCase();
  return (
    e?.code === "ER_DUP_ENTRY" ||
    e?.errno === 1062 ||
    e?.sqlState === "23000" ||
    msg.includes("duplicate entry")
  );
};

/* ===== 공용 모달 쿼리 헬퍼 ===== */
const modalQuery = async (alias, { q = "", page = 1, size = 10 } = {}) => {
  const s = toInt(size, 10);
  const p = toInt(page, 1);
  return mapper.query(alias, [q, q, q, s, (p - 1) * s]);
};

/* ===== 모달 ===== */
const listVendType = (opts) => modalQuery("selectVendType", opts);
const listVendId = (opts) => modalQuery("selectVendId", opts);
const listVendPsch = (opts) => modalQuery("selectVendPsch", opts);

/* ===== 조회 ===== */
const vendorSearchParams = (b = {}) => [
  toNull(b.vendId),
  nz(b.vendId),
  toNull(b.vendName),
  nz(b.vendName),
  toNull(b.vendType),
  nz(b.vendType),
  toNull(b.psch), // Add the 7th parameter
  nz(b.psch), // Add the 8th parameter
];

const vendorSearchParamsExactNameBiz = ({ vendName, bizNumber } = {}) => [
  toNull(vendName),
  nz(vendName),
  toNull(bizNumber),
  nz(bizNumber),
];

const listVendor = async (b = {}) => {
  const rows = await mapper.query("VENDOR.SEARCH", vendorSearchParams(b));
  return Array.isArray(rows) ? rows : rows?.rows ?? [];
};
/* ===== 등록/수정 파라미터 ===== */
const vendorInsertParams = (b = {}) => [
  b.vendName ?? "",
  b.bizNumber ?? "",
  b.cntinfo ?? "",
  b.vendType ?? "", // 코드명/코드ID 그대로
  b.useYn ?? "Y",
  b.address ?? "",
  b.psch ?? "",
  b.remark ?? null,
];

const vendorUpdateParams = (b = {}, id) => [
  b.vendName ?? "",
  b.bizNumber ?? "",
  b.cntinfo ?? "",
  b.vendType ?? "",
  b.useYn ?? "Y",
  b.address ?? "",
  b.psch ?? "",
  b.remark ?? "",
  id,
];

/* ===== 등록 후 재확인(선택) ===== */
const ensureVendorInsertedOr409 = async (b, result) => {
  // DB가 정상 반영했다면 OK
  if (result && (result.affectedRows === undefined || result.affectedRows > 0))
    return null;

  // 그렇지 않다면 정확 일치로 중복 여부 재확인
  const rows = await mapper.query(
    "VENDOR.SEARCH_EXACT",
    vendorSearchParamsExactNameBiz({
      vendName: b.vendName,
      bizNumber: b.bizNumber,
    })
  );
  const list = Array.isArray(rows) ? rows : rows?.rows ?? [];
  const dup = list.some(
    (r) => r.vendName === b.vendName && r.bizNumber === b.bizNumber
  );

  return dup
    ? { status: 409, body: { message: "이미 등록된 거래처입니다!" } }
    : { status: 500, body: { ok: false, message: "등록 실패" } };
};

//  삭제
const deleteVend = async (vendId) => {
  let resInfo = await mapper.query("vendDelete", [vendId]);

  if (resInfo.affectedRows > 0) {
    return {
      result: true,
    };
  } else {
    return {
      result: false,
    };
  }
};
module.exports = {
  // 유틸
  toNull,
  nz,
  toInt,
  isDupError,
  // 모달
  listVendType,
  listVendId,
  listVendPsch,
  // 조회
  vendorSearchParams,
  vendorSearchParamsExactNameBiz,
  listVendor,
  // 등록/수정
  vendorInsertParams,
  vendorUpdateParams,
  deleteVend,
  // 등록 후 재확인
  ensureVendorInsertedOr409,
};
