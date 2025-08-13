// server/services/facility_service.js
// 가정: ../database/mapper 의 query 함수가
//   rows = await mapper.query(sqlKey, params)
// 형태로 rows(Array)를 반환한다고 가정.
// COUNT 쿼리는 rows[0].total 로 접근.
// 필요 시 mapper 경로/시그니처는 실제 프로젝트에 맞게 조정.

const mapper = require("../database/mapper");

const facilityList = async (filters) => {
  let list = await mariadb.query("facilityList", filters);
  return list;
};

function toPaging({ page = 1, size = 10 }) {
  const p = Math.max(1, Number(page) || 1);
  const s = Math.max(1, Number(size) || 10);
  const offset = (p - 1) * s;
  return { page: p, size: s, limit: s, offset };
}

async function list({ page = 1, size = 10 } = {}) {
  const { limit, offset, page: p, size: s } = toPaging({ page, size });

  const rows = await mapper.query("SELECT_FACILITY_LIST", [limit, offset]);
  const countRows = await mapper.query("COUNT_FACILITY");
  const total = countRows?.[0]?.total ?? 0;

  return {
    items: rows,
    page: p,
    size: s,
    total,
    totalPages: Math.ceil(total / s),
  };
}

async function getById(id) {
  const rows = await mapper.query("SELECT_FACILITY_ONE", [id]);
  return rows?.[0] || null;
}

async function create({
  facility_code,
  facility_name,
  facility_type,
  use_yn = "Y",
}) {
  // 필수값 검증(필요 시 강화)
  if (!facility_code || !facility_name) {
    const err = new Error("facility_code, facility_name는 필수입니다.");
    err.status = 400;
    throw err;
  }
  const result = await mapper.query("INSERT_FACILITY", [
    facility_code,
    facility_name,
    facility_type || null,
    use_yn,
  ]);
  // 가정: INSERT 결과로 insertId를 받을 수 있음(프로젝트 환경에 따라 다를 수 있음)
  const insertId = result?.insertId ?? null;
  return insertId ? await getById(insertId) : { ok: true };
}

async function update(
  id,
  { facility_code, facility_name, facility_type, use_yn = "Y" }
) {
  const existing = await getById(id);
  if (!existing) {
    const err = new Error("대상 설비가 존재하지 않습니다.");
    err.status = 404;
    throw err;
  }
  await mapper.query("UPDATE_FACILITY", [
    facility_code ?? existing.facility_code,
    facility_name ?? existing.facility_name,
    facility_type ?? existing.facility_type,
    use_yn ?? existing.use_yn,
    id,
  ]);
  return await getById(id);
}

async function remove(id) {
  // 소프트 삭제를 원한다면 UPDATE_FACILITY로 use_yn='N' 세팅하도록 변경
  const existing = await getById(id);
  if (!existing) {
    const err = new Error("대상 설비가 존재하지 않습니다.");
    err.status = 404;
    throw err;
  }
  await mapper.query("DELETE_FACILITY", [id]);
  return { ok: true };
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
  facilityList,
};
