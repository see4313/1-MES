// Table : employee

// 조회
const selectEmp = `
SELECT 
    EMP_ID,
    EMP_NAME,
    DEPT_ID,
    phone,
    JOIN_CO,
    LEAVDORM,
    status,
    PERM,
    REMK
FROM employee
WHERE 1=1
    AND ( :name       IS NULL OR EMP_NAME = :name )
    AND ( :department IS NULL OR DEPT_ID = :department )
    AND ( :phone      IS NULL OR phone = :phone )
    AND ( :status     IS NULL OR status = :status )
    AND ( :permName   IS NULL OR PERM = :permName )
    AND ( :joinDate   IS NULL OR DATE(JOIN_CO) = :joinDate )
    AND ( :leavDate   IS NULL OR DATE(LEAVDORM) = :leavDate )
ORDER BY EMP_ID;
`;
// 등록

module.exports = {
  selectEmp,
};
