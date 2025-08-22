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
  const { itemType, startDate, goalDate, remark, details, bomDetails } = data;
  const type = typeMap[itemType];
  const sql = `call add_prod_instruct(?, ?, ?, ?, ?, ?, @out_no)`;
  const params = [
    type,
    startDate,
    goalDate,
    remark,
    JSON.stringify(details),
    JSON.stringify(bomDetails),
  ];
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
      p.drct_qty           as currProdQty,
      pid.status,
      coalesce(
        case when pid.status = -1 then '전량 폐기' end,
        prcs.prcs_name,
        '생산 완료'
      ) as prcsName
    from PROD_INSTRUCT_DETAIL pid
    join ITEM i 
      on i.item_id = pid.item_id
    left join PROCESS_ROUTING prcsroute 
      on prcsroute.item_id = pid.item_id
    and prcsroute.op_no   = pid.status
    left join PROCESS prcs 
      on prcs.prcs_number  = prcsroute.prcs_number
    join PRODUCTION p
      on pid.deta_instruct_no = p.deta_instruct_no
      where pid.instruct_no = ?
      order by pid.deta_instruct_no;
  `;

  const params = [query.instructNo];

  return { sql, params };
};

const selectStatusZeroProductionList = () => {
  const sql = `
    SELECT
      pid.instruct_no        AS instructNo,
      prod.deta_instruct_no  AS detaInstructNo,
      prod.prod_no           AS prodNo,
      pid.item_id            AS itemId,
      i.item_type            AS itemType,
      i.item_name            AS itemName,
      prod.prcs_number       AS prcsNumber,
      cur.op_no              AS currentOpNo,
      last.lastOpNo          AS lastOpNo,
      prcs.prcs_name         AS prcsName,
      pi.instruct_datetime   AS instructDatetime,
      prod.drct_qty          AS drctQty,
      prod.status,
      prod.remk
    FROM PRODUCTION prod
    JOIN PROD_INSTRUCT_DETAIL pid
      ON prod.deta_instruct_no = pid.deta_instruct_no
    JOIN ITEM i
      ON pid.item_id = i.item_id
    JOIN PROCESS prcs
      ON prod.prcs_number = prcs.prcs_number
    JOIN PROCESS_ROUTING cur
      ON prod.prcs_number = cur.prcs_number
    AND pid.item_id     = cur.item_id
    JOIN (
        SELECT item_id, MAX(op_no) AS lastOpNo
        FROM PROCESS_ROUTING
        GROUP BY item_id
    ) last
      ON pid.item_id     = last.item_id
    JOIN PROD_INSTRUCT pi
      ON pid.instruct_no = pi.instruct_no
    WHERE prod.status = 0
    ORDER BY prod.prod_no DESC
 `;
  return { sql };
};

const selectFacilityListByName = (fNumber) => {
  console.log(fNumber);
  const sql = `
    select
      f.facility_id as facilityId,
      f.facility_nm as facilityName
    from FACILITY f
    join PROCESS prcs
    on prcs.prcs_number = f.facility_type
    where USE_YN = 'Y'
    and prcs.prcs_number = ?
  `;

  params = [fNumber];

  return { sql, params };
};

const insertProdACMSLT = (data) => {
  const {
    prodNo,
    itemId,
    empNo,
    facilityNo,
    inputQty,
    inferQty,
    prodQty,
    currOpNo,
    remk,
  } = data;

  const sql = `
    call add_prod_acmslt(?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  params = [
    prodNo,
    itemId,
    empNo,
    facilityNo,
    inputQty,
    inferQty,
    prodQty,
    currOpNo,
    remk,
  ];

  return { sql, params };
};

const bomItemList = (filters) => {
  let sql = `
    SELECT bd.item_id,
           b.item_id as parent_item,
           i.item_name,
           i.conv_qty,
           bd.usage,
           bd.unit,
           bd.loss
    FROM   BOM_DETAIL bd JOIN BOM b
					               ON   bd.bom_number = b.bom_number
                         JOIN ITEM i
                         ON   bd.item_id = i.item_id
    WHERE  1 = 1
  `;

  const params = [];

  if (filters.item_id) {
    sql += " AND b.item_id = ?";
    params.push(filters.item_id);
  }

  return { sql, params };
};

module.exports = {
  insertProdInstruct,
  selectInstructionList,
  selectDetailInstruction,
  selectStatusZeroProductionList,
  selectFacilityListByName,
  insertProdACMSLT,
  bomItemList,
};
