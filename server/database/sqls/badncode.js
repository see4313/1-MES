const badnSelect = `
SELECT badn_code
     , badn_name
     , badn_resn
     , insp_mthd
     , regist_de
     , uon
     , prcs_number
     FROM  BADN
`;

const badnInsert = `
INSERT INTO badn
  (badn_code, badn_name, badn_resn, insp_mthd, regist_de, uon, prcs_number)
VALUES
  (?, ?, ?, ?, NOW(), ?, ?)`;

module.exports = { badnSelect, badnInsert };
