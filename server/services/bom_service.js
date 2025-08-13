const { query } = require("../database/mapper");
const { BOM_LIST, BOM_DETAILS } = require("../database/sqls/bom");

console.log("[BOM SQL LOADED]", {
  hasList: typeof BOM_LIST === "string",
  hasDetails: typeof BOM_DETAILS === "string",
});

function buildListParams(q = {}) {
  const bom_number = q.bom_number || "";
  const item_name = q.item_name || "";
  const item_id = q.item_id || "";
  const ver = q.ver || "";
  const use_yn = q.use_yn || "";

  // 10개(각 조건 2개씩) 순서 주의!
  return [
    bom_number,
    bom_number,
    item_name,
    item_name,
    item_id,
    item_id,
    ver,
    ver,
    use_yn,
    use_yn,
  ];
}

async function listBom(filters = {}) {
  const params = buildListParams(filters);
  console.log("[SERVICE] listBom params:", params);
  return query(BOM_LIST, params);
}

async function getBomDetails(bomNumber) {
  if (!bomNumber) throw new Error("bomNumber required");
  console.log("[SERVICE] getBomDetails:", bomNumber);
  return query(BOM_DETAILS, [bomNumber]);
}

module.exports = { listBom, getBomDetails };
