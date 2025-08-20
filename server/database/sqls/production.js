// production.js

const typeMap = { semi: "반제품", finish: "완제품" };

// 정규화
const asArray = (q, name) => {
  let v = q[name] ?? q[`${name}[]`];
  if (v == null || v === "") return [];
  if (Array.isArray(v)) return v.filter((x) => x !== "");
  if (typeof v === "string") {
    return v.includes(",")
      ? v
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [v.trim()];
  }
  return [String(v).trim()];
};

const asString = (q, name) => {
  let v = q[name] ?? q[`${name}[]`];
  return typeof v === "string" ? v.trim() : "";
};

const insertProdInstruct = (data) => {
  const { itemType, startDate, goalDate, remark, details } = data;
  const type = typeMap[itemType];
  const sql = `call add_prod_instruct(?, ?, ?, ?, ?, @out_no)`;
  const params = [type, startDate, goalDate, remark, JSON.stringify(details)];
  return { sql, params };
};

const selectInstructionList = (query = {}) => {
  const q = {
    instructionNo: asString(query, "instructionNo"),
    types: asArray(query, "types"),
    status: asArray(query, "status"),
    productIds: asArray(query, "productIds"),
  };

  let sql = `
    select
      pi.instruct_no       as instructNo,
      pi.deta_plan_no      as detaPlanNo,
      pi.item_type         as itemType,
      pi.instruct_datetime as instructDatetime,
      pi.status,
      pi.goal_datetime     as goalDatetime,
      pi.remk,
      pi.start_datetime    as startDatetime
    from PROD_INSTRUCT pi
  `;

  const where = [];
  const params = [];

  if (q.instructionNo) {
    where.push(`pi.instruct_no like ?`);
    params.push(`%${q.instructionNo}%`);
  }

  if (q.types.length) {
    const expandType = (t) =>
      t === "semi"
        ? ["semi", "반제품"]
        : t === "finish"
        ? ["finish", "완제품"]
        : [t];

    const typesForDb = q.types.flatMap(expandType);
    where.push(`pi.item_type IN (${typesForDb.map(() => "?").join(",")})`);
    params.push(...typesForDb);
  }

  if (q.status.length) {
    where.push(`pi.status in (${q.status.map(() => "?").join(",")})`);
    params.push(...q.status);
  }

  if (q.productIds.length) {
    where.push(`exists (
      select 1
      from PROD_INSTRUCT_DETAIL pid
      where pid.instruct_no = pi.instruct_no
      and pid.item_id in (${q.productIds.map(() => "?").join(",")})
    )`);
    params.push(...q.productIds);
  }

  if (where.length) sql += `\nWHERE ` + where.join(`\n  and `);
  sql += `\norder by pi.instruct_datetime desc`;

  return { sql, params };
};

const selectDetailInstruction = (query) => {
  let sql = `
    select
      pid.deta_instruct_no as detaInstructNo,
      pid.item_id          as itemId,
      i.item_name          as itemName,
      pid.goal_qty         as goalQty,
      pid.status
    from PROD_INSTRUCT_DETAIL pid
    join ITEM i on i.item_id = pid.item_id
    where pid.instruct_no = ?
    order by pid.deta_instruct_no
  `;

  const params = [query.instructNo];

  return { sql, params };
};

const selectStatusZeroProductionList = () => {
  const sql = `
    SELECT
        prod.prod_no          AS prodNo,
        prod.deta_instruct_no AS detaInstructNo,
        pid.item_id           AS itemId,
        i.item_type           AS itemType,
        i.item_name           AS itemName,
        prod.prcs_number      AS prcsNumber,
        prcs.prcs_name		  AS prcsName,
        prod.drct_qty         AS drctQty,
        prod.status,
        prod.remk
    FROM PRODUCTION prod
    JOIN PROD_INSTRUCT_DETAIL pid
      ON prod.deta_instruct_no = pid.deta_instruct_no
    JOIN ITEM i
      ON pid.item_id = i.item_id
    JOIN PROCESS prcs
      ON prod.prcs_number = prcs.prcs_number
    WHERE prod.status = 0
 `;
  return { sql };
};

module.exports = {
  insertProdInstruct,
  selectInstructionList,
  selectDetailInstruction,
  selectStatusZeroProductionList
};
