// server/database/sqls/failureType.js
module.exports = {
  // 모든 유형 조회 (코드 + 이름만)
  selectFailureTypes: `
    SELECT FAIL_TYPE_CD AS code,
           FAIL_TYPE_NM AS name
    FROM FAILURE_TYPE
    WHERE IS_ACTIVE = 'Y'
  `,

  // 전체 컬럼 조회
  selectFailureTypesAll: `
    SELECT *
    FROM FAILURE_TYPE
    WHERE IS_ACTIVE = 'Y'
  `,
};
