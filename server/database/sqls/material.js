// 재고목록 조회
const inventoryList = (filters) => {
  let sql = `
    SELECT iv.lot_id
         , iv.item_id
         , it.item_name
         , it.item_type
         , iv.wh_id
         , wh.wh_name
         , iv.crea_date
         , iv.vald_date
         , (iv.entebord_qty - iv.dlivy_qty) AS qty
         , it.cutd_cond
         , iv.bnt
         , iv.status
         , iv.remk
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

// 품목번호 모달용
const itemId = `
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
WHERE  uon = 'Y'
`;

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

// 사원 모달용
const selectEmp = `
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
AND    dept_id = 'D002'
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
AND    p.regist_date < ?
`;

// 발주상세 조회
const selectProcDetail = `
SELECT pd.pcmt_detail_id
     , pd.procument_id
     , pd.item_id
     , pd.qty
     , pd.untpc
     , pd.status
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
  itemId,
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
};
