// server/database/sqls/vendor.js

// ===== 조회 =====
const VENDOR_SEARCH = `
SELECT
  V.VEND_ID    AS vendId,
  V.VEND_NAME  AS vendName,
  V.BIZ_NUMBER AS bizNumber,
  V.CNTINFO    AS cntinfo,
  COALESCE(C.CMMN_NAME, V.VEND_TYPE) AS vendType,  -- 코드명 없으면 코드값
  V.UON      AS useYn,
  V.ADDRESS    AS address,
  V.PSCH       AS psch,
  V.REMK       AS remark
FROM VENDOR V
LEFT JOIN CMMN_CODE C
  ON C.GROUP_ID = 'VENDOR_TYPE'
 AND (C.CMMN_ID = V.VEND_TYPE OR C.CMMN_NAME = V.VEND_TYPE)
WHERE 1=1
  AND (? IS NULL OR V.VEND_ID   LIKE CONCAT('%', ?, '%'))
  AND (? IS NULL OR V.VEND_NAME LIKE CONCAT('%', ?, '%'))
  AND (
    ? IS NULL
    OR CONCAT(
         IFNULL(C.CMMN_ID,   ''), ' ',
         IFNULL(C.CMMN_NAME, ''), ' ',
         IFNULL(V.VEND_TYPE, '')
       ) LIKE CONCAT('%', ?, '%')
  )
ORDER BY V.VEND_ID DESC
`;

/* 중복 체크용: 거래처명 + 사업자번호 정확 일치 */
const VENDOR_SEARCH_EXACT = `
SELECT
  V.VEND_ID    AS vendId,
  V.VEND_NAME  AS vendName,
  V.BIZ_NUMBER AS bizNumber
FROM VENDOR V
WHERE 1=1
  AND (? IS NULL OR V.VEND_NAME  = ?)
  AND (? IS NULL OR V.BIZ_NUMBER = ?)
`;

// ===== 등록 =====
const VENDOR_INSERT = `
INSERT INTO VENDOR
  (VEND_ID, VEND_NAME, BIZ_NUMBER, CNTINFO, VEND_TYPE, UON, ADDRESS, PSCH, REMK)
VALUES
  (next_code('VD'), ?, ?, ?, ?, ?, ?, ?, ?)
`;

// ===== 수정 (ID 기준) =====
const VENDOR_UPDATE = `
UPDATE VENDOR
   SET VEND_NAME  = ?,   
       BIZ_NUMBER = ?,    
       CNTINFO    = ?,    
       VEND_TYPE  = ?,   
       UON      = ?,  
       ADDRESS    = ?,   
       PSCH       = ?,    
       REMK       = ?    
 WHERE VEND_ID    = ?;     
`;

// ===== 모달: 유형 =====
const selectVendType = `
SELECT 
  C.CMMN_ID   AS type_id,
  C.CMMN_NAME AS vend_type
FROM CMMN_CODE C
WHERE C.GROUP_ID = 'VENDOR_TYPE'
  AND UON = 'Y'
  AND (COALESCE(?, '') = '' 
       OR C.CMMN_ID   LIKE CONCAT('%', ?, '%') 
       OR C.CMMN_NAME LIKE CONCAT('%', ?, '%'))
ORDER BY C.CMMN_ID
LIMIT ? OFFSET ?;
`;

// ===== 모달: 번호 =====
const selectVendId = `
SELECT 
  V.VEND_ID   AS vend_id,
  V.VEND_NAME AS vend_name
FROM VENDOR V
WHERE UON = 'Y'
  AND (COALESCE(?, '') = '' 
       OR V.VEND_ID   LIKE CONCAT('%', ?, '%') 
       OR V.VEND_NAME LIKE CONCAT('%', ?, '%'))
ORDER BY V.VEND_ID
LIMIT ? OFFSET ?;
`;
//=======모달: 사원(담당자) ======
const selectVendPsch = `
SELECT 
  E.EMP_ID   AS emp_id,
  E.EMP_NAME AS emp_name
FROM EMPLOYEE E
WHERE STATUS = '재직'
  AND (COALESCE(?, '') = '' 
       OR E.EMP_ID   LIKE CONCAT('%', ?, '%') 
       OR E.EMP_NAME LIKE CONCAT('%', ?, '%'))
ORDER BY E.EMP_ID
LIMIT ? OFFSET ?;
`;

//삭제
const vendDelete = `
DELETE FROM VENDOR
WHERE VEND_ID = ?
`;

module.exports = {
  // mapper 별칭 키에 맞춰 export
  "VENDOR.SEARCH": VENDOR_SEARCH,
  "VENDOR.SEARCH_EXACT": VENDOR_SEARCH_EXACT,
  "VENDOR.INSERT": VENDOR_INSERT,
  "VENDOR.UPDATE": VENDOR_UPDATE,
  selectVendPsch,
  selectVendType,
  selectVendId,
  vendDelete,
};
