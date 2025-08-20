// 재고목록 조회
const inventoryList = (filters) => {
  let sql = `
    SELECT iv.lot_id
         , iv.item_id
         , it.item_name
         , it.item_type
         , it.spec
         , iv.wh_id
         , wh.wh_name
         , iv.crea_date
         , iv.vald_date
         , (iv.entebord_qty - iv.dlivy_qty) AS qty
         , it.cutd_cond
         , iv.bnt
         , iv.status
         , iv.remk
         , iv.his_id
    FROM   INVENTORY iv JOIN ITEM it
                        ON   iv.item_id = it.item_id
                        JOIN WAREHOUSE wh
                        ON   iv.wh_id = wh.wh_id
    WHERE  1=1
  `;

  const params = [];

  if (filters.item_id) {
    sql += " AND iv.item_id = ?";
    params.push(filters.item_id);
  }
  if (filters.wh_id) {
    sql += " AND iv.wh_id = ?";
    params.push(filters.wh_id);
  }
  if (filters.lot_id) {
    sql += " AND iv.lot_id = ?";
    params.push(filters.lot_id);
  }
  if (filters.item_type) {
    sql += " AND it.item_type = ?";
    params.push(filters.item_type);
  }
  if (filters.cutd_cond) {
    sql += " AND it.cutd_cond = ?";
    params.push(filters.cutd_cond);
  }
  if (filters.vald_date) {
    sql += " AND iv.vald_date < ?";
    params.push(filters.vald_date);
  }
  if (filters.status) {
    sql += " AND iv.status = ?";
    params.push(filters.status);
  }

  return { sql, params };
};

// 출고이력 조회
const historyList = (filters) => {
  let sql = `
    WITH latest_exam AS (
    SELECT *,
           ROW_NUMBER() OVER(PARTITION BY rsrt_id ORDER BY exam_date DESC) AS rn
    FROM ITEM_EXAM_HIS
)
SELECT 
    lh.history_id,
    lh.lot_id,
    COALESCE(iv.item_id, le.item_id) AS item_id,
    lh.rsrt_id,
    COALESCE(i.item_name, i2.item_name) AS item_name,
    COALESCE(i.item_type, i2.item_type) AS item_type,
    lh.use_qty,
    lh.use_date,
    lh.remk
FROM LOT_HISTORY lh
LEFT JOIN INVENTORY iv ON lh.lot_id = iv.lot_id
LEFT JOIN ITEM i ON iv.item_id = i.item_id
LEFT JOIN latest_exam le ON lh.rsrt_id = le.rsrt_id AND le.rn = 1
LEFT JOIN ITEM i2 ON le.item_id = i2.item_id
WHERE 1 = 1
  `;

  const params = [];

  if (filters.item_id) {
    sql += " AND iv.item_id = ?";
    params.push(filters.item_id);
  }
  if (filters.use_date) {
    sql += " AND lh.use_date < ?";
    params.push(filters.use_date);
  }

  sql += " ORDER BY lh.use_date desc";

  return { sql, params };
};

// 로그인 조회
const userLogin = (filters) => {
  let sql = `
    SELECT e.emp_id,
           e.emp_name,
           e.status,
           e.leavdorm,
           e.perm,
           e.dept_id,
           d.dept_name,
           e.phone,
           e.remk
    FROM   EMPLOYEE e JOIN DEPARTMENT d
                      ON   e.dept_id = d.dept_id
    WHERE  1 = 1
  `;

  const params = [];

  if (filters.emp_id) {
    sql += " AND e.emp_id = ?";
    params.push(filters.emp_id);
  }
  if (filters.emp_pw) {
    sql += " AND e.emp_id = ?";
    params.push(filters.emp_pw);
  }

  return { sql, params };
};

// 사원 모달
const selectEmp = (filters) => {
  let sql = `
    SELECT emp_id
        , emp_name
        , status
        , join_co
        , leavdorm
        , perm
        , dept_id
        , phone
        , remk
    FROM   EMPLOYEE
    WHERE  status = '재직'
    `;

  const params = [];
  console.log(filters.dept_id);
  if (filters.dept_id) {

    sql += " AND dept_id = ?";
    params.push(filters.dept_id);
  }

  return { sql, params };
};

// 품목조회
const itemList = (filters) => {
  let sql = `
    SELECT item_id
         , item_name
         , item_type
         , unit
         , spec
         , cutd_cond
         , conv_qty
         , safe_qty
         , exp_date
         , uon
         , remk
    FROM   ITEM
    WHERE  1=1
  `;

  const params = [];

  if (filters.item_name) {
    sql += " AND item_name = ?";
    params.push(filters.item_name);
  }
  if (filters.item_type) {
    sql += " AND item_type = ?";
    params.push(filters.item_type);
  }
  if (filters.cutd_cond) {
    sql += " AND cutd_cond = ?";
    params.push(filters.cutd_cond);
  }
  if (filters.uon) {
    sql += " AND uon = ?";
    params.push(filters.uon);
  }

  sql += " ORDER BY item_id desc";

  return { sql, params };
};

// LOT번호 모달용
const lotId = `
SELECT lot_id
     , item_id
     , wh_id
     , crea_date
     , vald_date
     , entebord_qty
     , dlivy_qty
     , bnt
     , status
     , remk
FROM   INVENTORY
WHERE  1=1
`;

// 품목구분 모달용
const itemType = `
SELECT cmmn_id, group_id, cmmn_name, uon
FROM   CMMN_CODE
WHERE  group_id = 'ITEM_TYPE'
`;

// 보관조건 모달용
const cutdCond = `
SELECT cmmn_id, group_id, cmmn_name, uon
FROM   CMMN_CODE
WHERE  group_id = 'CUTD_COND'
`;

// 단위 모달용
const itemUnit = `
SELECT cmmn_id, group_id, cmmn_name, uon
FROM   CMMN_CODE
WHERE  group_id = 'ITEM_UNIT'
`;

// 창고번호 모달용
const whId = `
SELECT wh_id
     , wh_name
     , wh_type
     , loca
     , temp
     , rh
     , uon
     , remk
FROM   WAREHOUSE
WHERE  uon = 'Y'
`;

// 거래처 모달용
const selectVend = `
SELECT vend_id
     , biz_number
     , vend_name
     , vend_type
     , address
     , cntinfo
     , psch
     , uon
     , remk
FROM   VENDOR
WHERE  uon = 'Y'
`;

// 품목 삭제
const itemDelete = `
DELETE FROM ITEM
WHERE item_id = ?
`;

// 품목 수정
const itemUpdate = `
UPDATE ITEM
SET    item_name = ?, item_type = ?, unit = ?, spec = ?, cutd_cond = ?, uon = ?, remk = ?, conv_qty = ?, exp_date = ?
WHERE  item_id = ?
`;

// 품목 등록
const itemInsert = `
INSERT INTO ITEM (item_id, item_name, item_type, unit, spec, cutd_cond, uon, remk, conv_qty, exp_date)
VALUES (next_code('P'), ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

// 발주 등록
const procInsert = `
CALL proc_insert(?, ?, ?, ?, ?, ?)
`;

// 입고 등록
const receive = `
CALL proc_receive(?)
`;

// 반품 처리
const itemReturn = `
CALL item_return(?)
`;

// 폐기 처리
const itemdispose = `
CALL item_dispose(?)
`;

// 발주 조회
const selectProc = `
SELECT p.procument_id
     , p.vend_id
     , p.emp_id
     , v.vend_name
     , e.emp_name
     , p.regist_date
     , p.paprd_date
     , p.status
     , p.remk
FROM   PROCUMENT p JOIN VENDOR v
                   ON   p.vend_id = v.vend_id
                   JOIN EMPLOYEE e
                   ON   p.emp_id = e.emp_id
WHERE  p.status = '미완료'
AND    p.regist_date <= ?
`;

// 발주상세 조회
const selectProcDetail = `
SELECT pd.pcmt_detail_id
     , pd.procument_id
     , pd.item_id
     , pd.qty
     , pd.untpc
     , pd.status
     , pd.remain_qty
     , i.item_name
     , i.unit
     , i.spec
     , (pd.qty * pd.untpc) as totpc
FROM   PROCUMENT_DETAIL pd JOIN ITEM i
                           ON   pd.item_id = i.item_id
WHERE  pd.status = '미완료'
AND    pd.procument_id = ?
`;

module.exports = {
  inventoryList,
  itemList,
  lotId,
  itemType,
  cutdCond,
  whId,
  itemInsert,
  itemUpdate,
  itemDelete,
  itemUnit,
  selectVend,
  selectEmp,
  procInsert,
  selectProc,
  selectProcDetail,
  receive,
  itemReturn,
  itemdispose,
  historyList,
  userLogin,
};
