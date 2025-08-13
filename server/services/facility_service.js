// server/services/facility_service.js
const mariadb = require("../database/mapper.js");

const facilityList = async (filters) => {
  let list = await mariadb.query("facilityList", filters);
  return list;
};

// //  페이징 계산
// function toPaging({ page = 1, size = 10 }) {
//   const p = Math.max(1, Number(page) || 1);
//   const s = Math.max(1, Number(size) || 10);
//   const offset = (p - 1) * s;
//   return { page: p, size: s, limit: s, offset };
// }

// //  기본 목록 (페이징)
// async function list({ page = 1, size = 10 } = {}) {
//   const { limit, offset, page: p, size: s } = toPaging({ page, size });

//   const rows = await mapper.query("SELECT_FACILITY_LIST", [limit, offset]);
//   const countRows = await mapper.query("COUNT_FACILITY");
//   const total = countRows?.[0]?.total ?? 0;

//   return {
//     items: rows,
//     page: p,
//     size: s,
//     total,
//     totalPages: Math.ceil(total / s),
//   };
// }

//  단건 조회
// async function getById(id) {
//   const rows = await mapper.query("SELECT_FACILITY_ONE", [id]);
//   return rows?.[0] || null;
// }

//  등록
// async function create({
//   facility_code,
//   facility_name,
//   facility_type,
//   use_yn = "Y",
// }) {
//   if (!facility_code || !facility_name) {
//     const err = new Error("facility_code, facility_name는 필수입니다.");
//     err.status = 400;
//     throw err;
//   }
//   const result = await mapper.query("INSERT_FACILITY", [
//     facility_code,
//     facility_name,
//     facility_type || null,
//     use_yn,
//   ]);
//   const insertId = result?.insertId ?? null;
//   return insertId ? await getById(insertId) : { ok: true };
// }

// //  수정
// async function update(
//   id,
//   { facility_code, facility_name, facility_type, use_yn = "Y" }
// ) {
//   const existing = await getById(id);
//   if (!existing) {
//     const err = new Error("대상 설비가 존재하지 않습니다.");
//     err.status = 404;
//     throw err;
//   }
//   await mapper.query("UPDATE_FACILITY", [
//     facility_code ?? existing.facility_code,
//     facility_name ?? existing.facility_name,
//     facility_type ?? existing.facility_type,
//     use_yn ?? existing.use_yn,
//     id,
//   ]);
//   return await getById(id);
// }

// //  삭제 (하드 삭제)
// async function remove(id) {
//   const existing = await getById(id);
//   if (!existing) {
//     const err = new Error("대상 설비가 존재하지 않습니다.");
//     err.status = 404;
//     throw err;
//   }
//   await mapper.query("DELETE_FACILITY", [id]);
//   return { ok: true };
// }

module.exports = {
  // list,
  // getById,
  // create,
  // update,
  // remove,
  facilityList,
};
