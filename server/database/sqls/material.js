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

// 보관조건 모달용
const cutdCond = `
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

module.exports = {
  inventoryList,
  itemList,
  itemId,
  lotId,
  itemType,
  cutdCond,
  whId,
};
