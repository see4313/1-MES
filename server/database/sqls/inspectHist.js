module.exports = {
  // 점검이력 조회 (필터링 포함)
  inspectHistList: (filters) => {
    let sql = `
      SELECT ih.INSPECT_HIST_ID   AS inspect_hist_id
           , ih.OPERATION_LOG_ID  AS operation_log_id
           , ih.FACILITY_ID2      AS facility_id2
           , f.FACILITY_NM        AS facility_nm
           , ih.INSPECT_ITEM      AS inspect_item
           , ih.MEASURE_VAL       AS measure_val
           , ih.UNIT_NM           AS unit_nm
           , ih.JUDGE_RESULT      AS judge_result
           , ih.INSPECT_DTTM      AS inspect_dttm
           , ih.INSPECT_STD_ID    AS inspect_std_id
           , ih.EMP_ID            AS emp_id
           , e.EMP_NM             AS emp_nm
           , ih.REMK              AS remk
      FROM INSPECT_HIST ih
         LEFT JOIN FACILITY f ON ih.FACILITY_ID2 = f.FACILITY_ID
         LEFT JOIN EMPLOYEE e ON ih.EMP_ID = e.EMP_ID
      WHERE 1=1
    `;
    const params = [];

    if (filters.facility_nm) {
      sql += " AND f.FACILITY_NM LIKE ?";
      params.push(`%${filters.facility_nm}%`);
    }

    if (filters.emp_nm) {
      sql += " AND e.EMP_NM LIKE ?";
      params.push(`%${filters.emp_nm}%`);
    }

    if (filters.inspect_item) {
      sql += " AND ih.INSPECT_ITEM LIKE ?";
      params.push(`%${filters.inspect_item}%`);
    }

    if (filters.start_dt) {
      sql += " AND ih.INSPECT_DTTM >= ?";
      params.push(filters.start_dt);
    }

    if (filters.end_dt) {
      sql += " AND ih.INSPECT_DTTM <= ?";
      params.push(filters.end_dt);
    }

    sql += " ORDER BY ih.INSPECT_DTTM DESC";

    return { sql, params };
  },

  // 등록
  inspectHistInsert: `
    INSERT INTO INSPECT_HIST
    (OPERATION_LOG_ID, FACILITY_ID2, INSPECT_ITEM, MEASURE_VAL, UNIT_NM,
     JUDGE_RESULT, INSPECT_DTTM, INSPECT_STD_ID, EMP_ID, REMK)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,

  // 수정
  inspectHistUpdate: `
    UPDATE INSPECT_HIST
       SET FACILITY_ID2   = ?
         , INSPECT_ITEM   = ?
         , MEASURE_VAL    = ?
         , UNIT_NM        = ?
         , JUDGE_RESULT   = ?
         , INSPECT_DTTM   = ?
         , INSPECT_STD_ID = ?
         , EMP_ID         = ?
         , REMK           = ?
     WHERE INSPECT_HIST_ID = ?
  `,

  // 삭제
  inspectHistDelete: `
    DELETE FROM INSPECT_HIST WHERE INSPECT_HIST_ID = ?
  `,
};
