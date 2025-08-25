// server/services/bom_service.js
const mapper = require("../database/mapper");

/* ========== helpers ========== */
const rows = (r) => {
  if (!r) return [];
  if (Array.isArray(r)) {
    // [ [rows], fields ] 혹은 여러 resultset 중 첫 rows 집계
    for (let i = 0; i < r.length; i++) {
      const v = r[i];
      if (Array.isArray(v)) return v;
      if (v && Array.isArray(v.rows)) return v.rows;
    }
    return typeof r[0] === "object" ? r : [];
  }
  return r.rows ?? (typeof r === "object" ? [r] : []);
};
const first = (r) => rows(r)[0] ?? null;
const yn = (v) => (String(v ?? "Y").toUpperCase() === "N" ? "N" : "Y");
const verLabel = (v) => {
  const m = String(v ?? "").match(/\d+/);
  const n = m ? Number(m[0]) : 1;
  return `ver${n > 0 ? n : 1}`;
};

// header 입력 normalization
const parseHeader = (h = {}) => ({
  itemId: h.item_id ?? h.itemId ?? h.ITEM_ID ?? h.ITEMID ?? "",
  useYn: yn(h.use_yn ?? h.use ?? h.useYn ?? "Y"),
  ver: h.ver ?? h.VER ?? null,
  start: h.start_date ?? h.startDate ?? null,
  end: h.end_date ?? h.endDate ?? null,
  remk: h.remk ?? h.remark ?? null,
});

// 상세 검증
function validateDetails(details) {
  if (!Array.isArray(details)) throw new Error("details는 배열이어야 합니다.");
  details.forEach((d, i) => {
    if (!d?.item_id) throw new Error(`${i + 1}행: 품목번호 필수`);
    if (d.usage === undefined || d.usage === null)
      throw new Error(`${i + 1}행: 투입량(usage) 필수`);
    const usage = Number(d.usage);
    const loss = Number(d.loss ?? 0);
    if (Number.isNaN(usage) || usage < 0)
      throw new Error(`${i + 1}행: 투입량은 0 이상`);
    if (!d.unit) throw new Error(`${i + 1}행: 단위 필수`);
    if (Number.isNaN(loss) || loss < 0)
      throw new Error(`${i + 1}행: LOSS는 0 이상`);
  });
}

/* ========== 조회/유틸 ========== */
async function listBom(filters = {}) {
  return rows(await mapper.query("selectBomList", filters));
}
async function getBomDetails(bomNumber) {
  try {
    // 읽기 전 고아행 정리(아이템 테이블에 없는 상세행 제거)
    await mapper.query("deleteOrphanDetailsByBom", [bomNumber]).catch(() => {});
    return rows(await mapper.query("selectBomDetails", bomNumber));
  } catch {
    return [];
  }
}
async function itemModal(keyword = "", scope = "") {
  return rows(await mapper.query("itemModal", { keyword, scope }));
}
async function nextVerLabelByItemId(itemId) {
  if (!itemId) return "ver1";
  const raw = await mapper.query("SQL_NEXT_VER_BY_ITEM", [itemId]);
  return first(raw)?.next_ver || "ver1";
}
async function findLatestBomNumberByItem(itemId) {
  if (!itemId) return null;
  const r = await mapper.query("SQL_FIND_LATEST_BOM_BY_ITEM", [itemId]);
  return first(r)?.bom_number ?? first(r)?.BOM_NUMBER ?? null;
}
async function getBomHeader(bomNumber) {
  if (!bomNumber) return null;
  const r = await mapper.query("SQL_GET_BOM_HEADER", [bomNumber]);
  return first(r);
}
//
/* ========== 헤더 CRUD ========== */
async function insertBomHeader(b = {}) {
  if (!b.itemId)
    throw { status: 400, body: { message: "ITEM_ID는 필수입니다." } };
  if (!b.startDate)
    throw { status: 400, body: { message: "시작일은 필수입니다." } };

  const ver = await nextVerLabelByItemId(b.itemId);
  const params = [
    b.itemId,
    yn(b.use ?? b.use_yn ?? b.useYn),
    ver,
    b.startDate ?? null,
    b.endDate ?? null,
    b.remk ?? b.remark ?? null,
  ];
  const res = await mapper.query("SQL_BOM_INSERT", params);
  return { inserted: !!res?.affectedRows, ver };
}

async function updateBomHeader(bomNumber, b = {}) {
  if (!bomNumber)
    throw { status: 400, body: { message: "BOM 번호가 필요합니다." } };

  const params = [
    b.itemId ?? "",
    yn(b.use ?? b.use_yn ?? b.useYn),
    verLabel(b.ver),
    b.startDate ?? null,
    b.endDate ?? null,
    b.remk ?? b.remark ?? null,
    bomNumber,
  ];
  const res = await mapper.query("SQL_BOM_UPDATE", params);
  return { updated: !!res?.affectedRows };
}

/* ========== 제자리 버전업 (헤더 ver만 +1, 상세 upsert 선택) ========== */
async function versionUpInPlace(bomNumber, details = [], headerOv = {}) {
  if (!bomNumber) throw new Error("bomNumber가 필요합니다.");

  const h = await getBomHeader(bomNumber);
  if (!h) throw new Error("존재하지 않는 BOM입니다.");

  const nextVer = await nextVerLabelByItemId(h.item_id);

  await mapper.query("SQL_BOM_UPDATE", [
    h.item_id,
    yn(headerOv.use_yn ?? h.use_yn),
    nextVer,
    headerOv.start_date ?? h.start_date ?? null,
    headerOv.end_date ?? h.end_date ?? null,
    headerOv.remk ?? h.remk ?? null,
    bomNumber,
  ]);

  if (Array.isArray(details) && details.length) {
    validateDetails(details);
    await mapper.query("callSaveBomProc", [
      bomNumber, // p_bom_number
      null,
      null,
      null, // p_item_id, p_use_yn, p_ver 미사용
      null,
      null,
      null, // p_start_date, p_end_date, p_remk 미사용
      JSON.stringify(details),
    ]);
  }

  return { bom_number: bomNumber, ver: nextVer, created: false };
}

/* ========== (신규) 버전 유지 + 상세만 업서트 ========== */
async function upsertBomDetailsOnly(bomNumber, details = []) {
  if (!bomNumber) throw new Error("bomNumber가 필요합니다.");
  if (!Array.isArray(details) || details.length === 0)
    throw new Error("details는 1개 이상 필요합니다.");

  const h = await getBomHeader(bomNumber);
  if (!h) throw new Error("존재하지 않는 BOM입니다.");

  validateDetails(details);

  const raw = await mapper.query("callSaveBomProc", [
    bomNumber, // p_bom_number
    null,
    null,
    null,
    null,
    null,
    null,
    JSON.stringify(details),
  ]);
  const out = first(raw) || {};
  return {
    bom_number: out?.bom_number ?? bomNumber,
    detail_rows: out?.detail_rows ?? details.length,
  };
}

/* ========== 업서트: 같은 품목 존재 시 버전업, 없으면 신규 ========== */
async function upsertBomByItem({ header, details } = {}) {
  const h = parseHeader(header);
  if (!h.itemId)
    throw { status: 400, body: { message: "item_id는 필수입니다." } };

  const list = Array.isArray(details) ? details : [];

  // 같은 ITEM_ID의 최신 BOM 여부
  const latestBomNo = await findLatestBomNumberByItem(h.itemId);
  if (latestBomNo) {
    // 있으면: 제자리 버전업(상세 없으면 헤더만 올림)
    return await versionUpInPlace(latestBomNo, list, {
      use_yn: h.useYn,
      start_date: h.start,
      end_date: h.end,
      remk: h.remk,
    });
  }

  // 없으면 신규
  const ver = await nextVerLabelByItemId(h.itemId);

  if (list.length === 0) {
    // 상세 없이 헤더만
    await mapper.query("SQL_BOM_INSERT", [
      h.itemId,
      h.useYn,
      ver,
      h.start,
      h.end,
      h.remk,
    ]);
    const bom_number = await findLatestBomNumberByItem(h.itemId);
    return { bom_number, ver, created: true };
  }

  // 헤더+상세 동시 저장(프로시저)
  validateDetails(list);
  const raw = await mapper.query("callSaveBomProc", [
    null, // p_bom_number
    h.itemId,
    h.useYn,
    ver,
    h.start,
    h.end,
    h.remk,
    JSON.stringify(list),
  ]);
  const out = first(raw) || {};
  if (!out?.bom_number) throw new Error("BOM 저장 실패");
  return { bom_number: out.bom_number, ver, created: true };
}

/* ========== 삭제 ========== */
async function deleteBomDetail(bomNumber, detailCode) {
  if (!bomNumber || !detailCode) throw new Error("삭제 파라미터 누락");
  const res = await mapper.query("deleteBomDetail", [bomNumber, detailCode]);
  return { deleted: !!res?.affectedRows };
}

async function deleteBom(bomNumber) {
  if (!bomNumber) throw new Error("삭제 파라미터 누락");
  const id = String(bomNumber).trim();
  await mapper.query("BomDetail", [id]); // 상세 먼저
  const res = await mapper.query("BomHeader", [id]); // 헤더
  return { deleted: !!res?.affectedRows };
}

/* ========== exports ========== */
module.exports = {
  // 조회
  listBom,
  getBomDetails,
  itemModal,

  // 유틸
  nextVerLabelByItemId,
  findLatestBomNumberByItem,
  getBomHeader,

  // 헤더
  insertBomHeader,
  updateBomHeader,

  // 저장
  versionUpInPlace,
  upsertBomByItem,
  upsertBomDetailsOnly,

  // 삭제
  deleteBomDetail,
  deleteBom,
};
