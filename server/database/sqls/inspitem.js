const inspitem = `
SELECT
  INSP_ID,
  INSP_NM,
  INSP_MTHD,
  INSP_TYP,
  BASI_VAL,
  UNIT,
  UON,
  PRCS_FG,
  REMK,
  REGIST_DATE,
  MODI_DATE
FROM INSP_ITEM
`;

const inspInsert = `
INSERT INTO INSP_ITEM
  (INSP_ID, INSP_NM, INSP_MTHD, INSP_TYP, BASI_VAL, UNIT, UON, PRCS_FG, REMK, REGIST_DATE, MODI_DATE)
VALUES
  (next_code('QC'), ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
`;

// ⬇️ 추가
const inspUpdate = `
UPDATE INSP_ITEM
   SET INSP_NM = ?,
       INSP_MTHD = ?,
       INSP_TYP = ?,
       BASI_VAL = ?,
       UNIT = ?,
       UON = ?,
       PRCS_FG = ?,
       REMK = ?,
       MODI_DATE = NOW()
 WHERE INSP_ID = ?
`;

const inspDelect = `
DELETE FROM INSP_ITEM
WHERE INSP_ID = ?
`;

// 검사서 등록
const examInsert = `
CALL exam_insert(?, ?, ?, ?)
`;

const inspList = (filters) => {
  let sql = `
    SELECT insp_id,
           insp_nm,
           insp_mthd,
           insp_typ,
           basi_val,
           unit,
           uon,
           prcs_fg,
           remk,
           regist_date,
           modi_date
    FROM   INSP_ITEM
    WHERE  1 = 1
  `;

  const params = [];

  if (filters.uon) {
    sql += " AND uon = ?";
    params.push(filters.uon);
  }

  return { sql, params };
};

const examDetail = (filters) => {
  let sql = `
    SELECT ed.exam_detail_id,
	         ed.exam_id,
           ew.item_id,
           i.item_name,
           i.item_type,
           ed.insp_id,
           ii.insp_nm,
           ii.insp_mthd,
           ii.insp_typ,
           ii.basi_val,
           ed.remk
    FROM   EXAM_DETAIL ed JOIN EXAM_WR ew
					                ON   ed.exam_id = ew.exam_id
                          JOIN INSP_ITEM ii
                          ON   ii.insp_id = ed.insp_id
                          JOIN ITEM i
                          ON   ew.item_id = i.item_id
    WHERE  1 = 1
  `;

  const params = [];

  if (filters.item_id) {
    sql += " AND ew.item_id = ?";
    params.push(filters.item_id);
  }

  return { sql, params };
};

const prodList =
  // `
  // SELECT pa.rsrt_id,
  // 	     pa.prod_id,
  //        p.deta_instruct_no,
  //        pid.item_id,
  //        i.item_type,
  //        i.item_name,
  //        pa.emp_id,
  //        e.emp_name,
  //        pa.facility_id,
  //        pa.input_qty,
  //        pa.infer_qty,
  //        pa.prod_qty,
  //        pa.from_date,
  //        pa.to_date,
  //        pa.remk
  // FROM   PROD_ACMSLT pa JOIN PRODUCTION p
  // 				              ON   pa.prod_id = p.prod_no
  //                       JOIN PROD_INSTRUCT_DETAIL pid
  //                       ON   p.deta_instruct_no = pid.deta_instruct_no
  //                       JOIN ITEM i
  //                       ON   pid.item_id = i.item_id
  //                       JOIN EMPLOYEE e
  //                       ON   pa.emp_id = e.emp_id
  // `;
//   `
// SELECT pa.rsrt_id,
//        pa.prod_id,
//        p.deta_instruct_no,
//        p.prcs_number,
//        pid.item_id,
//        i.item_type,
//        i.item_name,
//        pa.emp_id,
//        e.emp_name,
//        pa.facility_id,
//        pa.input_qty,
//        pa.infer_qty,
//        pa.prod_qty,
//        pa.from_date,
//        pa.to_date,
//        pa.remk
// FROM   PROD_ACMSLT pa
// JOIN   PRODUCTION p
//        ON pa.prod_id = p.prod_no
// JOIN   PROD_INSTRUCT_DETAIL pid
//        ON p.deta_instruct_no = pid.deta_instruct_no
// JOIN   ITEM i
//        ON pid.item_id = i.item_id
// JOIN   EMPLOYEE e
//        ON pa.emp_id = e.emp_id
// JOIN (
//     SELECT pr.ITEM_ID, pr.PRCS_NUMBER
//     FROM PROCESS_ROUTING pr
//     JOIN (
//         SELECT ITEM_ID, MAX(OP_NO) AS MAX_OP_NO
//         FROM PROCESS_ROUTING
//         GROUP BY ITEM_ID
//     ) t
//       ON pr.ITEM_ID = t.ITEM_ID
//      AND pr.OP_NO = t.MAX_OP_NO
// ) pr_max
//   ON pid.item_id = pr_max.ITEM_ID
//  AND p.prcs_number = pr_max.PRCS_NUMBER
//`

`
SELECT 
       la.rsrt_id,
       la.prod_id,
       p.deta_instruct_no,
       p.prcs_number,
       pid.item_id,
       i.item_type,
       i.item_name,
       la.emp_id,
       e.emp_name,
       la.facility_id,
       fa.input_qty,
       isq.total_infer_qty AS infer_qty,
       la.prod_qty,
       fa.from_date AS from_date,   -- 첫 번째 실적의 시작일자
       la.to_date,
       la.remk
FROM PRODUCTION p
JOIN PROD_INSTRUCT_DETAIL pid
  ON p.deta_instruct_no = pid.deta_instruct_no
JOIN ITEM i
  ON pid.item_id = i.item_id
JOIN (
       SELECT a1.prod_id, a1.input_qty, a1.from_date
         FROM PROD_ACMSLT a1
         JOIN (SELECT prod_id, MIN(rsrt_id) AS min_rsrt
                 FROM PROD_ACMSLT GROUP BY prod_id) x
           ON a1.prod_id = x.prod_id AND a1.rsrt_id = x.min_rsrt
     ) fa ON fa.prod_id = p.prod_no
JOIN (
       SELECT a2.rsrt_id, a2.prod_id, a2.prod_qty, a2.emp_id, a2.facility_id,
              a2.from_date, a2.to_date, a2.remk
         FROM PROD_ACMSLT a2
         JOIN (SELECT prod_id, MAX(rsrt_id) AS max_rsrt
                 FROM PROD_ACMSLT GROUP BY prod_id) y
           ON a2.prod_id = y.prod_id AND a2.rsrt_id = y.max_rsrt
     ) la ON la.prod_id = p.prod_no
JOIN (
       SELECT prod_id, SUM(infer_qty) AS total_infer_qty
         FROM PROD_ACMSLT
        GROUP BY prod_id
     ) isq ON isq.prod_id = p.prod_no
LEFT JOIN EMPLOYEE e
  ON la.emp_id = e.emp_id
WHERE p.status = 1
  AND NOT EXISTS (
        SELECT 1
          FROM ITEM_EXAM_HIS h
         WHERE h.rsrt_id = la.rsrt_id
      );

`
;

// 발주 등록
const examHisInsert = `
CALL examHisInsert(?, ?, ?, ?, ?, ?, ?)
`;

module.exports = {
  inspitem,
  inspInsert,
  inspUpdate,
  inspDelect,
  inspList,
  examInsert,
  examDetail,
  prodList,
  examHisInsert,
};
