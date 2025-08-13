// server/sqls/bom_sql.js

const selectBomList = (filters = {}) => {
  let sql = `
    SELECT B.BOM_NUMBER                          AS bom_number
         , B.ITEM_ID                             AS item_id
         , I.ITEM_NAME                           AS item_name
         , B.VER                                 AS ver
         , B.\`USE\`                              AS use_yn      
         , DATE_FORMAT(B.START_DATE, '%Y-%m-%d') AS start_date
         , DATE_FORMAT(B.END_DATE,   '%Y-%m-%d') AS end_date
         , B.REMK                                AS remk
    FROM   BOM B
           LEFT JOIN ITEM I ON I.ITEM_ID = B.ITEM_ID
    WHERE  1=1
  `;
  const params = [];

  // == 동적 조건 ==
  if (filters.bom_number) {
    sql += " AND B.BOM_NUMBER LIKE ?";
    params.push(`%${String(filters.bom_number).trim()}%`);
  }
  if (filters.item_id) {
    sql += " AND B.ITEM_ID = ?";
    params.push(String(filters.item_id).trim());
  }
  if (filters.item_name) {
    sql += " AND I.ITEM_NAME LIKE ?";
    params.push(`%${String(filters.item_name).trim()}%`);
  }
  if (filters.ver) {
    sql += " AND B.VER = ?";
    params.push(String(filters.ver).trim());
  }
  // use / use_yn 둘 다 대응
  const useFilter = filters.use_yn ?? filters.use;
  if (useFilter !== undefined && String(useFilter).trim() !== "") {
    sql += " AND B.`USE` = ?";
    params.push(String(useFilter).trim());
  }
  // 기간 필터(선택): 시작일/종료일 경계 포함
  if (filters.start_date_from) {
    sql += " AND B.START_DATE >= ?";
    params.push(String(filters.start_date_from).trim());
  }
  if (filters.start_date_to) {
    sql += " AND B.START_DATE <= ?";
    params.push(String(filters.start_date_to).trim());
  }
  if (filters.end_date_from) {
    sql += " AND B.END_DATE >= ?";
    params.push(String(filters.end_date_from).trim());
  }
  if (filters.end_date_to) {
    sql += " AND B.END_DATE <= ?";
    params.push(String(filters.end_date_to).trim());
  }

  // 정렬
  sql += " ORDER BY B.BOM_NUMBER DESC";

  return { sql, params };
};

const selectBomDetails = (bomNumber, filters = {}) => {
  let sql = `
    SELECT
        d.BOM_DETAIL_NO AS bom_detail_no,
        d.BOM_NUMBER    AS bom_number,
        d.ITEM_ID       AS item_id,
        i.ITEM_NAME     AS item_name,
        d.\`USAGE\`       AS usage_qty,
        d.UNIT          AS unit,
        d.LOSS          AS loss
    FROM
        BOM_DETAIL d
    LEFT JOIN
        ITEM i ON i.ITEM_ID = d.ITEM_ID
    WHERE
        d.BOM_NUMBER = ?
  `;

  const params = [String(bomNumber).trim()];

  // 동적 필터
  if (filters.item_id) {
    sql += ` AND d.ITEM_ID = ?`;
    params.push(String(filters.item_id).trim());
  }
  if (filters.item_name) {
    sql += ` AND i.ITEM_NAME LIKE ?`;
    params.push(`%${String(filters.item_name).trim()}%`);
  }
  if (filters.unit) {
    sql += ` AND d.UNIT = ?`;
    params.push(String(filters.unit).trim());
  }

  // 정렬
  sql += ` ORDER BY d.BOM_DETAIL_NO`;

  return { sql, params };
};
module.exports = {
  selectBomList,
  selectBomDetails,
};
