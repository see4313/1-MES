// server/database/sqls/bom.js
//조회
const selectBomList = (filters = {}) => {
  let sql = `
    SELECT B.BOM_NUMBER            AS bom_number
         , B.ITEM_ID               AS item_id
         , I.ITEM_NAME             AS item_name
         , B.VER                   AS ver
         , B.\`USE\`               AS use_yn
         , DATE_FORMAT(B.START_DATE, '%Y-%m-%d') AS start_date
         , DATE_FORMAT(B.END_DATE,  '%Y-%m-%d') AS end_date
         , B.REMK                  AS remk
    FROM   BOM B
    LEFT JOIN ITEM I ON I.ITEM_ID = B.ITEM_ID
    WHERE  1=1
  `;
  const params = [];

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
  const useFilter = filters.use_yn ?? filters.use;
  if (useFilter !== undefined && String(useFilter) !== "") {
    sql += " AND B.`USE` = ?";
    params.push(String(useFilter));
  }
  if (filters.start_date_from) {
    sql += " AND B.START_DATE >= ?";
    params.push(String(filters.start_date_from));
  }
  if (filters.start_date_to) {
    sql += " AND B.START_DATE <= ?";
    params.push(String(filters.start_date_to));
  }
  if (filters.end_date_from) {
    sql += " AND B.END_DATE   >= ?";
    params.push(String(filters.end_date_from));
  }
  if (filters.end_date_to) {
    sql += " AND B.END_DATE   <= ?";
    params.push(String(filters.end_date_to));
  }

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
        d.USAGE      AS \`usage\`,
        d.LOSS       AS loss
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
// 품목명 조회
const BOM_DUP_BY_ID_VER = `
SELECT 1
  FROM BOM
 WHERE ITEM_ID = ?
   AND VER = ?
 LIMIT 1;
`;
//숫자증가
const SQL_NEXT_VER_BY_ITEM = `
SELECT CONCAT(
         'ver',
         COALESCE(
           MAX(CAST(NULLIF(REGEXP_REPLACE(VER, '[^0-9]', ''), '') AS UNSIGNED)), 0
         ) + 1
       ) AS next_ver
  FROM BOM
 WHERE ITEM_ID = ?;
`;

// BOM INSERT (BOM_NUMBER 는 next_code('BOM') 사용)
const SQL_BOM_INSERT = `
INSERT INTO BOM
  (BOM_NUMBER, ITEM_ID, \`USE\`, VER, START_DATE, END_DATE, REMK)
VALUES
  (next_code('BOM'), ?, ?, ?, ?, ?, ?);`;

// BOM UPDATE
const SQL_BOM_UPDATE = `
UPDATE BOM
   SET ITEM_ID    = ?,
       \`USE\`    = ?,
       VER        = ?,
       START_DATE = ?,
       END_DATE   = ?,
       REMK       = ?
 WHERE BOM_NUMBER = ?;
`;

// 품목명 + 버전 정확 일치(중복 체크)
const BOM_DUP_BY_ID_VER_EXCEPT = `
SELECT 1
  FROM BOM
 WHERE ITEM_ID = ?
   AND VER     = ?
   AND BOM_NUMBER <> ?
 LIMIT 1;
`;

// 모달(품목)
const itemModal = `
SELECT item_id, item_name, spec, unit
FROM ITEM
`;

// 단건 삭제
const deleteBomDetail = `
  DELETE FROM BOM_DETAIL
  WHERE BOM_NUMBER = ?
    AND BOM_DETAIL_NO = ?
`;

//상세내역 프로시저
const callSaveBomProc = `
  CALL save_bom_with_details_compat(?, ?, ?, ?, ?, ?, ?, ?);
`;

const saveBomWithDetails = `
  CALL save_bom_with_details_compat(NULL, ?, ?, ?, ?, ?, ?, ?);
`;

// null 대신 빈 문자열 ''
const saveBomDetailsOnly = `
  CALL save_bom_with_details_compat(?, '', '', NULL, NULL, '', ?);
`;

//삭제
const BomHeader = `
DELETE FROM BOM
WHERE BOM_NUMBER = ?
`;
const BomDetail = `
DELETE FROM BOM_DETAIL
WHERE BOM_NUMBER = ?;`;

//같은 아이템일때 가장최신 버전찾기
const SQL_FIND_LATEST_BOM_BY_ITEM = `
SELECT B.BOM_NUMBER AS bom_number
  FROM BOM B
 WHERE TRIM(B.ITEM_ID) = TRIM(?)
 ORDER BY CAST(NULLIF(REGEXP_REPLACE(B.VER, '[^0-9]', ''), '') AS UNSIGNED) DESC,
          B.START_DATE DESC,
          B.BOM_NUMBER DESC
 LIMIT 1;
`;
//기존 BOM 헤더 단건 조회
const SQL_GET_BOM_HEADER = `
SELECT B.BOM_NUMBER                          AS bom_number,
       B.ITEM_ID                             AS item_id,
       B.\`USE\`                             AS use_yn,
       B.VER                                 AS ver,
       DATE_FORMAT(B.START_DATE,'%Y-%m-%d')   AS start_date,
       DATE_FORMAT(B.END_DATE, '%Y-%m-%d')    AS end_date,
       B.REMK                                 AS remk
  FROM BOM B
 WHERE B.BOM_NUMBER = ?;
`;

module.exports = {
  selectBomList,
  selectBomDetails,
  deleteBomDetail,
  itemModal,
  BomHeader,
  BomDetail,
  callSaveBomProc,
  saveBomWithDetails,
  saveBomDetailsOnly,
  BOM_DUP_BY_ID_VER,
  SQL_BOM_INSERT,
  SQL_BOM_UPDATE,
  SQL_NEXT_VER_BY_ITEM,
  BOM_DUP_BY_ID_VER_EXCEPT,
  SQL_FIND_LATEST_BOM_BY_ITEM,
  SQL_GET_BOM_HEADER,
};
