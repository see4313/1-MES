// Table : employee

// 조회
const selectEmp = `
SELECT
    EMP_ID,
    EMP_NAME,
    DEPT_ID,
    PHONE,
    JOIN_CO,
    LEAVDORM,
    STATUS,
    PERM,
    REMK
FROM EMPLOYEE
WHERE 1=1
    AND ( ? IS NULL OR EMP_NAME = ? )
    AND ( ? IS NULL OR DEPT_ID = ? )
    AND ( ? IS NULL OR PHONE = ? )
    AND ( ? IS NULL OR STATUS = ? )
    AND ( ? IS NULL OR PERM = ? )
    AND ( ? IS NULL OR DATE(JOIN_CO) = ? )
    AND ( ? IS NULL OR DATE(LEAVDORM) = ? )
   
ORDER BY EMP_ID
`;

module.exports = {
  selectEmp,
};
