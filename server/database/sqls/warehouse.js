const warehouseList = (filters = {}) => {
  let sql = `
    SELECT
      WH_ID   AS warehouseId,
      WH_NAME AS warehouseName,
      WH_TYPE AS warehouseType,
      LOCA    AS warehouseLoca,
      TEMP    AS temp,
      RH      AS rh,
      UON     AS useYn,
      REMK    AS remark
    FROM WAREHOUSE
    WHERE 1=1
  `;
  const params = [];

  if (filters.warehouseId) {
    sql += " AND WH_ID LIKE ?";
    params.push(`%${filters.warehouseId}%`);
  }
  if (filters.warehouseName) {
    sql += " AND WH_NAME LIKE ?";
    params.push(`%${filters.warehouseName}%`);
  }
  if (filters.warehouseType) {
    sql += " AND WH_TYPE LIKE ?";
    params.push(`%${filters.warehouseType}%`);
  }
  if (filters.warehouseLoca) {
    sql += " AND LOCA LIKE ?";
    params.push(`%${filters.warehouseLoca}%`);
  }
  if (filters.temp) {
    sql += " AND TEMP LIKE ?";
    params.push(`${filters.temp}`);
  }
  if (filters.rh) {
    sql += " AND RH LIKE ?";
    params.push(`${filters.rh}`);
  }
  if (filters.useYn) {
    sql += " AND UON = ?";
    params.push(filters.useYn);
  }

  sql += " ORDER BY WH_ID";
  return { sql, params };
};

// 등록 (번호 자동생성)
const warehouseCreate = (body = {}) => {
  const sql = `
    INSERT INTO WAREHOUSE (WH_ID, WH_NAME, WH_TYPE, LOCA, TEMP, RH, UON, REMK)
    VALUES (next_code('WH'), ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    body.warehouseName, // WH_NAME
    body.warehouseType, // WH_TYPE
    body.warehouseLoca, // LOCA
    body.temp, // TEMP
    body.rh, // RH
    body.useYn ?? "Y", // UON
    body.remark ?? null, // REMK
  ];
  return { sql, params };
};

/** 중복(창고명+위치) 존재 체크 */
function existsByNameAndLoca(payload = {}) {
  const { warehouseName, warehouseLoca, excludeWhId } = payload;

  let sql = `
    SELECT COUNT(*) AS cnt
      FROM WAREHOUSE
     WHERE WH_NAME = ?
       AND LOCA    = ?
  `;
  const params = [warehouseName, warehouseLoca];
  if (excludeWhId) {
    sql += ` AND WH_ID <> ?`;
    params.push(excludeWhId);
  }
  sql += ` LIMIT 1`;
  return { sql, params };
}

/** 수정 (식별자: WH_ID) */
function warehouseUpdate(payload = {}) {
  const { id } = payload;
  if (!id) throw new Error("warehouseUpdate: id is required");

  const v = (x) => (x === undefined ? null : x);

  const sql = `
    UPDATE WAREHOUSE
       SET WH_NAME = COALESCE(?, WH_NAME),
           WH_TYPE = COALESCE(?, WH_TYPE),
           LOCA    = COALESCE(?, LOCA),
           TEMP    = COALESCE(?, TEMP),
           RH      = COALESCE(?, RH),
           UON     = COALESCE(?, UON),
           REMK    = COALESCE(?, REMK)
     WHERE WH_ID   = ?
  `;
  const params = [
    v(payload.warehouseName),
    v(payload.warehouseType),
    v(payload.warehouseLoca),
    v(payload.temp),
    v(payload.rh),
    v(payload.useYn),
    v(payload.remark),
    id,
  ];
  return { sql, params };
}

// 보관조건 모달용
const cutdCond = `
SELECT cmmn_id, group_id, cmmn_name, uon
FROM   CMMN_CODE
WHERE  group_id = 'CUTD_COND'
`;

//삭제
const whDelete = `
DELETE FROM WAREHOUSE
WHERE WH_ID = ?
`;

module.exports = {
  whDelete,
  cutdCond,
  warehouseList,
  warehouseCreate,
  warehouseUpdate,
  existsByNameAndLoca,
};
