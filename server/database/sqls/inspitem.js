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
  (next_code('QC'), ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
`;

// ⬇️ 추가
const inspUpdate = `
UPDATE INSP_ITEM
   SET INSP_NM = ?,
       INSP_MTHD = ?,
       INSP_TYP = ?,
       BASI_VAL = ?,
       UNIT = ?,
       UON = ?,
       PRCS_FG = ?,
       REMK = ?,
       MODI_DATE = NOW()
 WHERE INSP_ID = ?
`;

const inspDelect = `
DELETE FROM INSP_ITEM
WHERE INSP_ID = ?
`;

module.exports = { inspitem, inspInsert, inspUpdate, inspDelect };
