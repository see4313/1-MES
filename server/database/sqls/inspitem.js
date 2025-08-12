// inspitem.js
const inspitem = `
SELECT
  INSP_ID,
  INSP_NM,
  INSP_MTHD,
  INSP_TYP,
  BASI_VAL,
  UNIT,
  UON,
  PRCS_FG,
  REMK,
  REGIST_DATE,
  MODI_DATE
FROM INSP_ITEM
`;

const inspInsert = `
INSERT INTO INSP_ITEM
  (INSP_ID, INSP_NM, INSP_MTHD, INSP_TYP, BASI_VAL, UNIT, UON, PRCS_FG, REMK, REGIST_DATE, MODI_DATE)
VALUES
  (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
`;

module.exports = { inspitem, inspInsert };
