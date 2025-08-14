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
    params.push(`%${String(filters.bom_number)}%`);
  }
  if (filters.item_id) {
    sql += " AND B.ITEM_ID LIKE ?";
    params.push(`%${String(filters.item_id)}%`);
  }
  if (filters.item_name) {
    sql += " AND I.ITEM_NAME LIKE ?";
    params.push(`%${String(filters.item_name)}%`);
  }
  if (filters.ver) {
    sql += " AND B.VER = ?";
    params.push(String(filters.ver));
  }
  // use / use_yn 둘 다 대응
  const useFilter = filters.use_yn ?? filters.use;
  if (useFilter !== undefined && String(useFilter) !== "") {
    sql += " AND B.`USE` = ?";
    params.push(String(useFilter));
  }
  // 기간 필터(선택): 시작일/종료일 경계 포함
  if (filters.start_date_from) {
    sql += " AND B.START_DATE >= ?";
    params.push(String(filters.start_date_from));
  }
  if (filters.start_date_to) {
    sql += " AND B.START_DATE <= ?";
    params.push(String(filters.start_date_to));
  }
  if (filters.end_date_from) {
    sql += " AND B.END_DATE >= ?";
    params.push(String(filters.end_date_from));
  }
  if (filters.end_date_to) {
    sql += " AND B.END_DATE <= ?";
    params.push(String(filters.end_date_to));
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
        i.SPEC       AS spec,
        d.UNIT          AS unit,
        d.LOSS          AS loss
    FROM
        BOM_DETAIL d
    LEFT JOIN
        ITEM i ON i.ITEM_ID = d.ITEM_ID
    WHERE
        d.BOM_NUMBER = ?
  `;

  const params = [String(bomNumber)];

  // 동적 필터
  if (filters.item_id) {
    sql += ` AND d.ITEM_ID = ?`;
    params.push(String(filters.item_id));
  }
  if (filters.item_name) {
    sql += ` AND i.ITEM_NAME LIKE ?`;
    params.push(`%${String(filters.item_name)}%`);
  }
  if (filters.unit) {
    sql += ` AND d.UNIT = ?`;
    params.push(String(filters.unit));
  }

  // 정렬
  sql += ` ORDER BY d.BOM_DETAIL_NO`;

  return { sql, params };
};

//bom등록
const bomInsert = `
INSERT INTO BOM
(BOM_NUMBER, ITEM_ID, \`USE\`, VER, START_DATE, END_DATE, REMK)
VALUES
(next_code('BOM'), ?, ?, ?, ?, ?, ?)
`;

// 모달 (품목)
const itemModal = `
SELECT item_id,
       item_name,
       spec,
       unit
FROM ITEM 
`;

// 단위 모달용
const itemUnit = `
SELECT cmmn_id, group_id, cmmn_name, uon
FROM   CMMN_CODE
WHERE  group_id = 'ITEM_UNIT'
`;

module.exports = {
  itemUnit,
  bomInsert,
  itemModal,
  selectBomList,
  selectBomDetails,
};
