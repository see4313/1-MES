// server/services/bom_service.js
const mapper = require("../database/mapper");

/* ========= helpers ========= */
const rows = (r) => {
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
const first = (r) => rows(r)[0] ?? null;
const yn = (v) => (String(v ?? "Y").toUpperCase() === "N" ? "N" : "Y");
const verLabel = (v) => {
  const m = String(v ?? "").match(/\d+/);
  const n = m ? Number(m[0]) : 1;
  return `ver${n > 0 ? n : 1}`;
};

/* ========= queries ========= */
async function listBom(filters = {}) {
  const raw = await mapper.query("selectBomList", filters);
  return rows(raw);
}

async function getBomDetails(bomNumber) {
  try {
    const raw = await mapper.query("selectBomDetails", bomNumber);
    return rows(raw);
  } catch {
    return [];
  }
}

async function itemModal() {
  const raw = await mapper.query("itemModal", []);
  return rows(raw);
}

async function nextVerLabelByItemId(itemId) {
  if (!itemId) return "ver1";
  const raw = await mapper.query("SQL_NEXT_VER_BY_ITEM", [itemId]);
  return first(raw)?.next_ver || "ver1";
}

/* ========= header insert/update ========= */
async function insertBomHeader(b = {}) {
  if (!b.itemId)
    throw { status: 400, body: { message: "ITEM_ID는 필수입니다." } };
  if (!b.startDate)
    throw { status: 400, body: { message: "시작일은 필수입니다." } };

  const ver = await nextVerLabelByItemId(b.itemId);
  const params = [
    b.itemId ?? "",
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

/* ========= proc save (header + details) ========= */
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
  const bomNumber = data.bomNumber ?? data.p_bom_number ?? null;
  const header = data.header ?? null;
  const details = data.details ?? data.p_details ?? [];
  const isNew = !bomNumber;

  validateDetails(details, isNew);

  // 신규만 헤더 채움
  const itemId = isNew
    ? data.p_item_id ?? header?.item_id ?? header?.itemId ?? null
    : null;
  const useYn = isNew
    ? data.p_use_yn ?? header?.use_yn ?? header?.use ?? "Y"
    : null;
  let ver = null;
  if (isNew) {
    if (!itemId) throw new Error("신규 저장: item_id는 필수입니다.");
    ver = await nextVerLabelByItemId(itemId);
  }

  const start = isNew
    ? data.p_start_date ?? header?.start_date ?? header?.startDate ?? null
    : null;
  const end = isNew
    ? data.p_end_date ?? header?.end_date ?? header?.endDate ?? null
    : null;
  const remk = isNew
    ? data.p_remk ?? header?.remk ?? header?.remark ?? null
    : null;

  const params = [
    bomNumber ?? null,
    itemId,
    yn(useYn),
    isNew ? ver : data.p_ver ?? header?.ver ?? null,
    start,
    end,
    remk,
    JSON.stringify(details),
  ];

  const raw = await mapper.query("callSaveBomProc", params);
  const out = first(raw) || {};
  if (out.bom_number == null)
    throw new Error("BOM 저장 처리 실패(프로시저 롤백).");

  return {
    bom_number: out.bom_number,
    detail_rows: out.detail_rows ?? null,
    ver: ver ?? null,
  };
}

/* ========= deletes ========= */
async function deleteBomDetail(bomNumber, detailCode) {
  if (!bomNumber || !detailCode) throw new Error("삭제 파라미터 누락");
  const res = await mapper.query("deleteBomDetail", [bomNumber, detailCode]);
  return { deleted: !!res?.affectedRows };
}

async function deleteBom(bomNumber) {
  if (!bomNumber) throw new Error("삭제 파라미터 누락");
  await mapper.query("BomDetail", [bomNumber]);
  const res = await mapper.query("BomHeader", [bomNumber]);
  return { deleted: !!res?.affectedRows };
}

/* ========= exports ========= */
module.exports = {
  listBom,
  getBomDetails,
  itemModal,
  nextVerLabelByItemId,
  insertBomHeader,
  updateBomHeader,
  saveBomViaProc,
  deleteBomDetail,
  deleteBom,
};
