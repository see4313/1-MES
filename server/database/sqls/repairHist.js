module.exports = {
  selectRepairHist: `
    SELECT r.REPAIR_HIST_ID     AS repair_hist_id,
           r.FAILURE_ID         AS failure_id,
           r.FAIL_TYPE_CD       AS fail_type_cd,
           f.FAIL_TYPE_NM       AS fail_type_nm,       -- 고장유형
           r.OPERATION_LOG_ID   AS operation_log_id,
           r.REPAIR_DT          AS repair_dt,          -- 수리일자
           r.REPAIR_END_DT      AS repair_end_dt,      -- 수리완료일자
           r.REPAIR_DETAIL      AS repair_detail,
           r.REPLACED_PART      AS replaced_part,
           r.POST_REPAIR_STATUS AS post_repair_status,
           r.REMK               AS remk,
           r.EMP_ID             AS emp_id,
           e.EMP_NAME           AS emp_name,
           r.FACILITY_ID        AS facility_id,
           fa.FACILITY_NM       AS facility_name,
           r.URGENCY_ID         AS urgency_id,
           u.URGENCY_NAME       AS urgency_name,       -- 긴급도
           d.FAILURE_OCC_DTTM   AS fail_dt,            -- 고장일자
           d.REPAIR_COMPLETE_YN AS oper_yn             -- 설비상태(Y/N)
    FROM REPAIR_HIST r
    LEFT JOIN FAILURE_TYPE f ON r.FAIL_TYPE_CD = f.FAIL_TYPE_CD
    LEFT JOIN EMPLOYEE e     ON r.EMP_ID = e.EMP_ID
    LEFT JOIN FACILITY fa    ON r.FACILITY_ID = fa.FACILITY_ID
    LEFT JOIN URGENCY u      ON r.URGENCY_ID = u.URGENCY_ID
    LEFT JOIN FAILURE d      ON r.FAILURE_ID = d.FAILURE_ID   -- 고장정보 조인
    WHERE 1=1;
  `,

  insertRepairHist: `
    INSERT INTO REPAIR_HIST
    (REPAIR_HIST_ID, FAILURE_ID, FAIL_TYPE_CD, OPERATION_LOG_ID,
     REPAIR_DT, REPAIR_END_DT, REPAIR_DETAIL, REPLACED_PART,
     POST_REPAIR_STATUS, REMK, EMP_ID, FACILITY_ID, URGENCY_ID)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,

  updateRepairHist: `
    UPDATE REPAIR_HIST
    SET FAIL_TYPE_CD = ?,
        REPAIR_DT = ?,
        REPAIR_END_DT = ?, 
        REPAIR_DETAIL = ?,
        REPLACED_PART = ?,
        POST_REPAIR_STATUS = ?, 
        REMK = ?,
        EMP_ID = ?,
        FACILITY_ID = ?,
        URGENCY_ID = ?
    WHERE REPAIR_HIST_ID = ?
  `,

  deleteRepairHist: `
    DELETE FROM REPAIR_HIST
    WHERE REPAIR_HIST_ID = ?
  `,
};
