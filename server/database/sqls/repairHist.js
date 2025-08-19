module.exports = {
  selectRepairHist: `
    SELECT r.REPAIR_HIST_ID,
           r.FAILURE_ID,
           r.FAIL_TYPE_CD,
           f.FAIL_TYPE_NM,
           r.OPERATION_LOG_ID,
           r.REPAIR_DT,
           r.REPAIR_END_DT,
           r.REPAIR_DETAIL,
           r.REPLACED_PART,
           r.POST_REPAIR_STATUS,
           r.REMK,
           r.EMP_ID,
           e.EMP_NAME,
           r.FACILITY_ID,
           fa.FACILITY_NAME
    FROM REPAIR_HIST r
    LEFT JOIN FAILURE_TYPE f ON r.FAIL_TYPE_CD = f.FAIL_TYPE_CD
    LEFT JOIN EMPLOYEE e ON r.EMP_ID = e.EMP_ID
    LEFT JOIN FACILITY fa ON r.FACILITY_ID = fa.FACILITY_ID
    WHERE 1=1
  `,

  insertRepairHist: `
    INSERT INTO REPAIR_HIST
    (REPAIR_HIST_ID, FAILURE_ID, FAIL_TYPE_CD, OPERATION_LOG_ID,
     REPAIR_DT, REPAIR_END_DT, REPAIR_DETAIL, REPLACED_PART,
     POST_REPAIR_STATUS, REMK, EMP_ID, FACILITY_ID)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,

  updateRepairHist: `
    UPDATE REPAIR_HIST
    SET FAIL_TYPE_CD = ?, REPAIR_DT = ?, REPAIR_END_DT = ?, 
        REPAIR_DETAIL = ?, REPLACED_PART = ?, POST_REPAIR_STATUS = ?, 
        REMK = ?, EMP_ID = ?, FACILITY_ID = ?
    WHERE REPAIR_HIST_ID = ?
  `,
};
