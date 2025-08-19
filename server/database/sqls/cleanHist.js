// server/database/sqls/cleanHist.js

// 목록 조회 (필터: facility_id, emp_id, from_dt, to_dt)
// from_dt/to_dt 는 'YYYY-MM-DD HH:mm:ss' 형태 기대
const cleanHistList = (filters = {}) => {
  let sql = `
    SELECT
        c.CLEAN_HIST_ID                                   AS hist_id
      , c.FACILITY_ID                                     AS facility_id
      , f.FACILITY_NM                                     AS facility_name
      , c.EMP_ID                                          AS emp_id
      , e.EMP_NAME                                        AS emp_name
      , DATE_FORMAT(c.CLEAN_START_DT,'%Y-%m-%d %H:%i:%s') AS clean_start_dt
      , DATE_FORMAT(c.CLEAN_END_DT  ,'%Y-%m-%d %H:%i:%s') AS clean_end_dt
      , c.REMK                                            AS remk
      , CASE
            WHEN c.IS_ACTIVE = 'N' THEN '무효'
            WHEN c.CLEAN_END_DT IS NULL THEN '진행중'
            ELSE '완료'
        END                                               AS clean_status
    FROM CLEAN_HIST c
    LEFT JOIN FACILITY f ON f.FACILITY_ID = c.FACILITY_ID
    LEFT JOIN EMPLOYEE e ON e.EMP_ID      = c.EMP_ID
    WHERE 1=1
  `;
  const params = [];

  if (filters.facility_id) {
    sql += ` AND c.FACILITY_ID = ?`;
    params.push(filters.facility_id);
  }
  if (filters.emp_id) {
    sql += ` AND c.EMP_ID = ?`;
    params.push(filters.emp_id);
  }
  if (filters.from_dt) {
    sql += ` AND c.CLEAN_START_DT >= ?`;
    params.push(filters.from_dt);
  }
  if (filters.to_dt) {
    sql += ` AND c.CLEAN_END_DT   <= ?`;
    params.push(filters.to_dt);
  }

  sql += ` ORDER BY c.CLEAN_START_DT DESC, c.CLEAN_HIST_ID DESC`;

  return { sql, params };
};

// 등록: OPERATION_LOG_ID 가 NOT NULL이고 기본값 없을 때 포함
// * OPERATION_LOG_ID 컬럼이 없거나 NULL 허용이면, 마지막 컬럼/값을 지워도 됨.
const cleanHistInsert = `
  INSERT INTO CLEAN_HIST (
      CLEAN_HIST_ID
    , FACILITY_ID
    , EMP_ID
    , CLEAN_START_DT
    , CLEAN_END_DT
    , REMK
    , IS_ACTIVE
    , WORK_DTTM
    , OPERATION_LOG_ID
  )
  VALUES (
      next_code('HIS')   -- PK
    , ?                  -- FACILITY_ID
    , ?                  -- EMP_ID
    , ?                  -- CLEAN_START_DT 'YYYY-MM-DD HH:mm:ss'
    , ?                  -- CLEAN_END_DT   'YYYY-MM-DD HH:mm:ss'
    , ?                  -- REMK
    , 'Y'                -- IS_ACTIVE 기본값
    , NOW()              -- 작업시각
    , next_code('OPL')   -- 운영/작업 로그 ID (필요 없으면 이 행 제거)
  )
`;

// 정정(수정): 전달된 값만 반영 (NULL이면 기존값 유지)
const cleanHistUpdate = `
  UPDATE CLEAN_HIST
     SET FACILITY_ID     = COALESCE(?, FACILITY_ID)
       , EMP_ID          = COALESCE(?, EMP_ID)
       , CLEAN_START_DT  = COALESCE(?, CLEAN_START_DT)
       , CLEAN_END_DT    = COALESCE(?, CLEAN_END_DT)
       , REMK            = COALESCE(?, REMK)
       , WORK_DTTM       = NOW()
   WHERE CLEAN_HIST_ID   = ?
`;

// 무효 처리: IS_ACTIVE='N'로 전환 + 사유 저장
const cleanHistVoid = `
  UPDATE CLEAN_HIST
     SET IS_ACTIVE   = 'N'
       , WORK_DTTM   = NOW()
   WHERE CLEAN_HIST_ID = ?
`;

module.exports = {
  cleanHistList,
  cleanHistInsert,
  cleanHistUpdate,
  cleanHistVoid,
};
