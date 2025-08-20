// alias → 함수(필터 받아 { sql, params } 반환)
const processList = (filters = {}) => {
  let sql = `
    SELECT
      PRCS_NUMBER AS prscNo,
      PRCS_NAME   AS prcsName,
      UON         AS useYn,
      REMK        AS remark
    FROM \`PROCESS\`
    WHERE 1=1
  `;
  const params = [];

  if (filters.prscNo) {
    sql += " AND PRCS_NUMBER LIKE ?";
    params.push(`%${filters.prscNo}%`);
  }
  if (filters.prcsName) {
    sql += " AND PRCS_NAME   LIKE ?";
    params.push(`%${filters.prcsName}%`);
  }
  if (filters.useYn) {
    sql += " AND UON = ?";
    params.push(filters.useYn);
  }

  sql += " ORDER BY PRCS_NUMBER";
  return { sql, params };
};

// 등록 (번호 자동생성)
const processCreate = (body = {}) => {
  const sql = `
    INSERT INTO \`PROCESS\` (PRCS_NUMBER, PRCS_NAME, UON, REMK)
    VALUES (next_code('PRCS'), ?, ?, ?)
  `;
  const params = [body.prcsName, body.useYn ?? "Y", body.remark ?? null];
  return { sql, params };
};

// 수정 (PRCS_NUMBER 기준)
const processUpdate = (body = {}) => {
  const sql = `
    UPDATE \`PROCESS\`
       SET PRCS_NAME = ?, UON = ?, REMK = ?
     WHERE PRCS_NUMBER = ?
  `;
  const params = [body.prcsName, body.useYn, body.remark ?? null, body.prscNo];
  return { sql, params };
};

const processTypeList = (filters = {}) => {
  const sql = `
    SELECT
     TYPE_NAME AS type_name
    FROM FACILITY_TYPE
    ORDER BY TYPE_NAME ASC
  `;
  return { sql, params: [] };
};

//삭제
const processDelete = `
DELETE FROM PROCESS
WHERE PRCS_NUMBER = ?
`;

module.exports = {
  processList,
  processCreate,
  processUpdate,
  processTypeList,
  processDelete,
};
