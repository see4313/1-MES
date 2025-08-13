// Table : employee
//조회
const EMP_SEARCH = `
SELECT
  E.EMP_ID                           AS empId,
  E.EMP_NAME                         AS empName,
  D.DEPT_NAME                        AS deptName,
  E.PHONE                            AS phone,
  DATE_FORMAT(E.JOIN_CO,  '%Y-%m-%d') AS \`join\`,
  DATE_FORMAT(E.LEAVDORM,'%Y-%m-%d') AS leav,
  E.STATUS                           AS status,
  E.PERM                             AS perm,
  E.REMK                             AS remk
FROM EMPLOYEE E
LEFT JOIN DEPARTMENT D ON D.DEPT_ID = E.DEPT_ID
WHERE 1=1
  AND (? IS NULL OR E.EMP_NAME  LIKE CONCAT('%', ?, '%'))
  AND (? IS NULL OR D.DEPT_NAME LIKE CONCAT('%', ?, '%'))
  AND (? IS NULL OR E.PHONE     LIKE CONCAT('%', ?, '%'))
  AND (? IS NULL OR E.JOIN_CO   >= ?)
  AND (? IS NULL OR E.LEAVDORM  <= ?)
  AND (? IS NULL OR E.STATUS = ?)
  AND (? IS NULL OR E.PERM   = ?)
ORDER BY E.EMP_ID DESC

`;
//등록 INSERT (부서명으로 넘어오면 DEPT_ID 서브쿼리로 매핑)
const insertEmp = `
  INSERT INTO EMPLOYEE
  (EMP_ID,EMP_NAME, DEPT_ID, PHONE, JOIN_CO, LEAVDORM, STATUS, PERM, REMK)
VALUES
  (next_code('E'), ?, (SELECT DEPT_ID FROM DEPARTMENT WHERE DEPT_NAME = ? LIMIT 1), ?, ?, ?, ?, ?,?);
`;

//수정 UPDATE (id 기준 수정)
const updateEmp = `
  UPDATE EMPLOYEE
     SET EMP_NAME = ?,
         DEPT_ID  = (SELECT DEPT_ID FROM DEPARTMENT WHERE DEPT_NAME = ? LIMIT 1),
         PHONE    = ?,
         JOIN_CO  = ?,
         LEAVDORM  = ?,
         STATUS   = ?,
         PERM     = ?,
         REMK     = ?
   WHERE EMP_ID   = ?;
`;

//상태 모달
const selectStatus = `
  SELECT C.CMMN_ID AS status_id,
         C.CMMN_NAME AS status
  FROM CMMN_CODE C
  WHERE C.GROUP_ID = 'EMP_STATUS'
    AND \`UON\` = 'Y'
  ORDER BY C.CMMN_ID
  LIMIT ? OFFSET ?;
`;

// 권한 모달
const selectPerm = `
  SELECT C.CMMN_ID AS perm_id,
         C.CMMN_NAME AS perm_name
  FROM CMMN_CODE C
  WHERE C.GROUP_ID = 'EMP_PERM'
    AND \`USE\` = 'Y'
  ORDER BY C.CMMN_ID
  LIMIT ? OFFSET ?;
`;

//부서 모달
const selectDept = `
SELECT
  D.DEPT_ID   AS dept_id,
  D.DEPT_NAME AS dept_name
FROM DEPARTMENT D
WHERE \`USE\` = 'Y'
ORDER BY D.DEPT_ID
LIMIT ? OFFSET ?;
`;

module.exports = {
  selectStatus,
  selectPerm,
  selectDept,
  "EMP.SEARCH": EMP_SEARCH,
  "EMP.INSERT": insertEmp,
  "EMP.UPDATE": updateEmp,
};
