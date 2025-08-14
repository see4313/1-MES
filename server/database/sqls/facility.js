// 설비목록 조회
const facilityList = (filters) => {
  let sql = `
   SELECT f.FACILITY_ID      AS facility_id
     , f.FACILITY_NM      AS facility_nm
     ,f.FACILITY_TYPE     AS facility_type
     , ft.TYPE_NAME       AS facility_type_name
     , f.USE_YN           AS use_yn
     , f.PURCHASE_DT      AS purchase_dt
     , f.INSPECTION_CYCLE AS inspection_cycle
     , e.EMP_ID           AS emp_id
     , e.EMP_NAME         AS emp_name
     , f.REPLACEMENT_CYCLE AS replacement_cycle
     , f.TEMP_VAL         AS temp_val
     , f.HUMIDITY_VAL     AS humidity_val
     , f.RPM_VAL          AS rpm_val
     , f.POWER_VAL        AS power_val
     , f.REMK             AS remk
FROM FACILITY f
JOIN EMPLOYEE e ON f.EMP_ID = e.EMP_ID
JOIN FACILITY_TYPE ft ON f.FACILITY_TYPE = ft.TYPE_ID
WHERE 1=1
  `;
  const params = [];

  if (filters.facility_id) {
    sql += " AND f.FACILITY_ID = ?";
    params.push(filters.facility_id);
  }
  if (filters.facility_type) {
    sql += " AND f.FACILITY_TYPE = ?";
    params.push(filters.facility_type);
  }
  if (filters.emp_id) {
    sql += " AND e.EMP_ID = ?";
    params.push(filters.emp_id);
  }

  sql += " ORDER BY f.FACILITY_ID ASC";

  return { sql, params };
};

// 설비명 목록
const facilityNames = `
    SELECT FACILITY_ID AS item_id
         , FACILITY_NM AS item_name
    FROM FACILITY
    ORDER BY FACILITY_NM ASC
`;

// 설비유형 목록
const facilityTypes = `
    SELECT TYPE_ID AS type_id
         , TYPE_NAME AS type_name
    FROM FACILITY_TYPE
    WHERE USE_YN = 'Y'
    ORDER BY TYPE_NAME ASC
`;

// 담당자 목록
const facilityUsers = `
    SELECT EMP_ID AS user_id
         , EMP_NAME AS user_name
    FROM EMPLOYEE
    ORDER BY EMP_NAME ASC
`;

// 설비 등록
const facilityInsert = `
    INSERT INTO FACILITY (
       FACILITY_ID,FACILITY_NM, FACILITY_TYPE, EMP_ID, PURCHASE_DT,
        TEMP_VAL, HUMIDITY_VAL, RPM_VAL, POWER_VAL, REMK
    ) VALUES (next_code('FAC'),?, ?,?, ?, ?, ?, ?, ?, ?)
`;

// 설비 수정
const facilityUpdate = `
    UPDATE FACILITY
    SET FACILITY_NM = ?,
        FACILITY_TYPE = ?,
        EMP_ID = ?,
        PURCHASE_DT = ?,
        TEMP_VAL = ?,
        HUMIDITY_VAL = ?,
        RPM_VAL = ?,
        POWER_VAL = ?,
        REMK = ?
    WHERE FACILITY_ID = ?
`;

// 설비 삭제
const facilityDelete = `
    DELETE FROM FACILITY
    WHERE FACILITY_ID = ?
`;

module.exports = {
  facilityList,
  facilityNames,
  facilityTypes,
  facilityUsers,
  facilityInsert,
  facilityUpdate,
  facilityDelete,
};
