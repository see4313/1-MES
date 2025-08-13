// 설비목록 조회
const facilityList = (filters) => {
  let sql = `
    SELECT f.facility_id
         , f.facility_nm
         , f.facility_type
         , f.use_yn
         , f.purchase_dt
         , f.inspection_cycle
         , e.emp_id
         , f.replacement_cycle
         , f.temp_val
         , f.humidity_val
         , f.rpm_val
         , f.power_val
         , f.remk
    FROM   FACILITY f JOIN EMPLOYEE e
                        ON   f.emp_id = e.emp_id
    WHERE  1=1
  `;

  const params = [];

  if (filters.facility_id) {
    sql += " AND f.facility_id = ?";
    params.push(filters.facility_id);
  }
  if (filters.facility_type) {
    sql += " AND f.facility_type = ?";
    params.push(filters.facility_type);
  }
  if (filters.emp_id) {
    sql += " AND e.emp_id = ?";
    params.push(filters.emp_id);
  }

  // sql += " ORDER BY f.facility_id DESC";

  return { sql, params };
};
