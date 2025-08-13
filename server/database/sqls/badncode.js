const badnSelect = `
SELECT BADN_CODE
     , BADN_NAME
     , BADN_RESN
     , INSP_MTHD
     , REGIST_DE
     , UON
FROM BADN
ORDER BY REGIST_DE DESC
`;
const badnInsert = `
INSERT INTO BADN
  (BADN_CODE, BADN_NAME, BADN_RESN, INSP_MTHD, REGIST_DE, UON)
VALUES
  (next_code('BADN'), ?, ?, ?, NOW(), ?)
`;

module.exports = { badnSelect, badnInsert };
