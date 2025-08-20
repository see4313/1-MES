// server/services/bom_service.js
const mapper = require("../database/mapper");
const bom_sql = require("../database/sqls/bom");

// ...

/* ====================== 공용 유틸 (심플) ====================== */
// 다양한 DB 결과 형식을 "행 배열"로 통일
const rowsOf = (r) => {
  if (!r) return [];
  if (Array.isArray(r)) {
    for (let i = r.length - 1; i >= 0; i--) {
      const v = r[i];
      if (Array.isArray(v)) return v;
      if (v?.rows) return v.rows;
    }
    return typeof r[0] === "object" ? r : [];
  }
  return r?.rows ?? (typeof r === "object" ? [r] : []);
};

// 프로시저 멀티 결과셋에서 "첫 행"만 추출
const firstOut = (r) => rowsOf(r)[0] ?? null;

/* ====================== 조회 ====================== */
// BOM 목록
async function listBom(filters = {}) {
  if (typeof bom_sql.selectBomList !== "function")
    throw new Error("bom_sql.selectBomList is not a function");
  const raw = await mapper.query("selectBomList", filters);
  return rowsOf(raw);
}

// BOM 상세
async function getBomDetails(bomNumber) {
  try {
    const raw = await mapper.query("selectBomDetails", bomNumber);
    return rowsOf(raw);
  } catch {
    return []; // 상세 조회 실패는 빈 배열로 처리
  }
}

/* ====================== 모달 데이터 ====================== */
// 품목 모달
async function itemModal() {
  const raw = await mapper.query("itemModal", []);
  return rowsOf(raw);
}

/* ====================== 헤더 등록/수정 ====================== */
// 헤더 등록
async function insertBomHeader(b = {}) {
  if (!b.itemId)
    throw { status: 400, body: { message: "ITEM_ID는 필수입니다." } };
  if (!b.startDate)
    throw { status: 400, body: { message: "시작일은 필수입니다." } };

  const ver = Number(b.ver) || 1;

  // 사전 중복 체크: ITEM_ID + VER
  const dup =
    rowsOf(await mapper.query("BOM_DUP_BY_ID_VER", [b.itemId, ver])).length > 0;
  if (dup) throw { status: 409, body: { message: "이미 등록된 BOM입니다!" } };

  const params = [
    b.itemId ?? "",
    b.use ?? b.use_yn ?? "Y",
    ver,
    b.startDate ?? null,
    b.endDate ?? null,
    b.remk ?? b.remark ?? null,
  ];
  const result = await mapper.query("SQL_BOM_INSERT", params);
  return { inserted: !!result?.affectedRows };
}

// 헤더 수정
async function updateBomHeader(bomNumber, b = {}) {
  if (!bomNumber)
    throw { status: 400, body: { message: "BOM 번호가 필요합니다." } };

  const params = [
    b.itemId ?? "",
    b.use ?? b.use_yn ?? b.useYn ?? "Y",
    Number(b.ver) || 1,
    b.startDate ?? null,
    b.endDate ?? null,
    b.remk ?? b.remark ?? null,
    bomNumber,
  ];
  const result = await mapper.query("SQL_BOM_UPDATE", params);
  return { updated: !!result?.affectedRows };
}

/* ====================== 저장(프로시저) ====================== */

function validateDetails(details, isNew) {
  if (!Array.isArray(details))
    throw new Error("details는 배열 형태여야 합니다.");
  if (isNew && details.length === 0) throw new Error("상세가 비어 있습니다.");
  for (let i = 0; i < details.length; i++) {
    const d = details[i] ?? {};
    if (!d.item_id) throw new Error(`${i + 1}행: 품목번호 필수`);
    if (d.usage === undefined || d.usage === null)
      throw new Error(`${i + 1}행: 투입량(usage) 필수`);
    if (Number(d.usage) < 0 || Number.isNaN(Number(d.usage)))
      throw new Error(`${i + 1}행: 투입량은 0 이상`);
    if (!d.unit) throw new Error(`${i + 1}행: 단위 필수`);
    if (Number(d.loss ?? 0) < 0 || Number.isNaN(Number(d.loss ?? 0)))
      throw new Error(`${i + 1}행: LOSS는 0 이상`);
  }
}

async function saveBomViaProc(data = {}) {
  console.log(data);
  try {
    const bomNumber = data.bomNumber ?? data.p_bom_number ?? null;
    const header = data.header ?? null;
    const details = data.details ?? data.p_details ?? [];
    const isNew = !bomNumber;

    validateDetails(details, isNew);

    // 신규만 헤더 세팅, 기존은 null 전달
    const itemId = isNew ? data.p_item_id ?? header?.item_id ?? null : null;
    const useYn = isNew ? data.p_use_yn ?? header?.use_yn ?? "Y" : null;
    const ver = isNew ? data.p_ver ?? header?.ver ?? 1 : null;
    const start = isNew ? data.p_start_date ?? header?.start_date : null;
    const end = isNew ? data.p_end_date ?? header?.end_date : null;
    const remk = isNew ? data.p_remk ?? header?.remk ?? null : null;

    const params = [
      bomNumber ?? null,
      itemId,
      useYn,
      ver,
      start,
      end,
      remk,
      JSON.stringify(details),
    ];

    const raw = await mapper.query("callSaveBomProc", params);
    const out = firstOut(raw) || {};

    //프로시저 핸들러가 ROLLBACK할 때는 `SELECT NULL AS bom_number, 0 AS detail_rows`를 반환함
    if (out.bom_number == null) {
      console.error(
        "[saveBomViaProc] Procedure rolled back or failed. raw:",
        raw
      );
      throw new Error("BOM 저장 처리 실패(프로시저 롤백).");
    }

    // 정상: 프로시저가 알려준 값 그대로 신뢰
    return { bom_number: out.bom_number, detail_rows: out.detail_rows ?? null };
  } catch (error) {
    console.error("Error during saveBomViaProc:", error);
    throw error;
  }
}

/* ====================== 상세 삭제 ====================== */
async function deleteBomDetail(bomNumber, detailCode) {
  if (!bomNumber || !detailCode) throw new Error("삭제 파라미터 누락");

  const res = await mapper.query("deleteBomDetail", [bomNumber, detailCode]);
  return { deleted: !!res?.affectedRows };
}

//==============삭제

async function deleteBom(bomNumber) {
  if (!bomNumber) throw new Error("삭제 파라미터 누락");

  try {
    await mapper.query("BomDetail", [bomNumber]);

    const res = await mapper.query("BomHeader", [bomNumber]);

    return { deleted: !!res?.affectedRows };
  } catch (err) {
    console.error("BOM 삭제 오류:", err);
    throw err;
  }
}

/* ====================== 모듈 내보내기 ====================== */
module.exports = {
  // 조회/모달
  listBom,
  getBomDetails,
  itemModal,

  // 헤더
  insertBomHeader,
  updateBomHeader,

  // 저장/삭제
  saveBomViaProc,
  deleteBomDetail,
  deleteBom,
};
