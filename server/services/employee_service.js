const mapper = require("../database/mapper.js");

// 값 정규화
const toNull = (v) => (v === "" || v === undefined || v === null ? null : v);
const nz = (v) => (v === undefined || v === null ? "" : v);

// 중복키 에러 식별
const isDupError = (e) => {
  const msg = (e?.sqlMessage || e?.message || "").toLowerCase();
  return (
    e?.code === "ER_DUP_ENTRY" ||
    e?.errno === 1062 ||
    e?.sqlState === "23000" ||
    msg.includes("duplicate entry")
  );
};

// 페이지네이션 조회
const pagedQuery = async (sqlKey, page = 1, size = 10) => {
  // 숫자 변환 (문자열 들어오는 경우 방지)
  const limit = parseInt(size, 10) || 10;
  const currentPage = parseInt(page, 10) || 1;

  const offset = (currentPage - 1) * limit;

  const rows = await mapper.query(sqlKey, [limit, offset]);

  return {
    items: rows,
    page: currentPage,
    size: limit,
    hasMore: rows.length === limit,
  };
};

// EMP.SEARCH 조회용 파라미터
const empSearchParams = (b = {}, limit = 200) => [
  toNull(b.name),
  nz(b.name),
  toNull(b.dept),
  nz(b.dept),
  toNull(b.phone),
  nz(b.phone),
  toNull(b.joinDate),
  b.joinDate ?? null,
  toNull(b.leavDate),
  b.leavDate ?? null,
  toNull(b.status),
  nz(b.status),
  toNull(b.permName),
  nz(b.permName),
  limit,
];

// 정확 일치(name/phone만) 검색 파라미터 중복
const empSearchParamsExactNamePhone = (b) => [
  toNull(b.name),
  b.name ?? "",
  null,
  "",
  toNull(b.phone),
  b.phone ?? "",
  null,
  null,
  null,
  null,
  null,
  "",
  null,
  "",
  1,
];

// INSERT용 파라미터 등록
const empInsertParams = (b) => [
  b.name,
  b.dept,
  b.phone,
  b.joinDate ?? null,
  b.leavDate ?? null,
  b.status,
  b.permName,
  b.remark ?? null,
];

// INSERT 후 중복 재확인
const ensureInsertedOr409 = async (b, result) => {
  if (result && (result.affectedRows === undefined || result.affectedRows > 0))
    return null;

  const params = empSearchParamsExactNamePhone({
    name: b.name,
    phone: b.phone,
  });
  const dupRows = (await mapper.query("EMP.SEARCH", params)) || [];
  const isDup =
    Array.isArray(dupRows) &&
    dupRows.some((r) => r.empName === b.name && r.phone === b.phone);

  return isDup
    ? { status: 409, body: { message: "이미 등록된 사원입니다!" } }
    : { status: 500, body: { ok: false, message: "등록 실패" } };
};
// 사원 삭제
const deleteEmp = async (empId) => {
  let resInfo = await mapper.query("empDelete", [empId]);

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

// 서비스 메서드들
module.exports = {
  deleteEmp,
  isDupError,
  pagedQuery,
  empSearchParams,
  empInsertParams,
  ensureInsertedOr409,
};
