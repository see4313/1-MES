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

// 입고 등록
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
           ed.detail_sttus,
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

  if (filters.detail_sttus) {
    sql += " AND ed.detail_sttus = ?";
    params.push(filters.detail_sttus);
  }
  if (filters.item_id) {
    sql += " AND ew.item_id = ?";
    params.push(filters.item_id);
  }

  return { sql, params };
};

const prodList = `
SELECT pa.rsrt_id,
	     pa.prod_id,
       p.deta_instruct_no,
       pid.item_id,
       i.item_type,
       i.item_name,
       pa.emp_id,
       pa.facility_id,
       pa.input_qty,
       pa.infer_qty,
       pa.prod_qty,
       pa.from_date,
       pa.to_date,
       pa.remk
FROM   PROD_ACMSLT pa JOIN PRODUCTION p
				              ON   pa.prod_id = p.prod_no
                      JOIN PROD_INSTRUCT_DETAIL pid
                      ON   p.deta_instruct_no = pid.deta_instruct_no
                      JOIN ITEM i
                      ON   pid.item_id = i.item_id
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
};
