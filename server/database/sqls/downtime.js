module.exports = {
  selectDowntimeList: ({
    facility_id,
    emp_id,
    down_type_id,
    from_dt,
    to_dt,
    oper_yn,
    sort,
  }) => {
    let sql = `
      SELECT d.DOWN_ID, d.FACILITY_ID, f.FACILITY_NAME,
             d.EMP_ID, e.EMP_NAME,
             d.DOWN_TYPE_ID, t.DOWN_TYPE_NAME,
             d.DOWN_START_DT, d.DOWN_END_DT,
             d.OPER_YN, d.REMK, d.EDIT_REASON, d.IS_ACTIVE
      FROM DOWNTIME d
      JOIN FACILITY f ON d.FACILITY_ID = f.FACILITY_ID
      LEFT JOIN EMPLOYEE e ON d.EMP_ID = e.EMP_ID
      JOIN DOWN_TYPE t ON d.DOWN_TYPE_ID = t.DOWN_TYPE_ID
      WHERE d.IS_ACTIVE = 'Y'
    `;
    const params = [];
    if (facility_id) {
      sql += " AND d.FACILITY_ID = ?";
      params.push(facility_id);
    }
    if (emp_id) {
      sql += " AND d.EMP_ID = ?";
      params.push(emp_id);
    }
    if (down_type_id) {
      sql += " AND d.DOWN_TYPE_ID = ?";
      params.push(down_type_id);
    }
    if (from_dt) {
      sql += " AND d.DOWN_START_DT >= ?";
      params.push(from_dt);
    }
    if (to_dt) {
      sql += " AND d.DOWN_END_DT <= ?";
      params.push(to_dt);
    }
    if (oper_yn) {
      sql += " AND d.OPER_YN = ?";
      params.push(oper_yn);
    }

    if (sort === "dur_desc")
      sql +=
        " ORDER BY TIMESTAMPDIFF(MINUTE, d.DOWN_START_DT, d.DOWN_END_DT) DESC";
    else sql += " ORDER BY d.DOWN_START_DT DESC";

    return { sql, params };
  },

  insertDowntime: `
    INSERT INTO DOWNTIME
    (FACILITY_ID, EMP_ID, DOWN_TYPE_ID, DOWN_START_DT, DOWN_END_DT, OPER_YN, REMK, IS_ACTIVE)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'Y')
  `,

  updateDowntime: `
    UPDATE DOWNTIME
       SET FACILITY_ID = ?,
           EMP_ID = ?,
           DOWN_TYPE_ID = ?,
           DOWN_START_DT = ?,
           DOWN_END_DT = ?,
           OPER_YN = ?,
           REMK = ?,
           EDIT_REASON = ?
     WHERE DOWN_ID = ?
  `,

  voidDowntime: `
    UPDATE DOWNTIME
       SET IS_ACTIVE = 'N',
           EDIT_REASON = ?
     WHERE DOWN_ID = ?
  `,
};
