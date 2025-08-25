const productList = (filters) => {
  let sql = `
SELECT inv.lot_id, 
        inv.item_id,
        inv.crea_date,
        inv.vald_date,
        item.item_name, 
        item.item_type,
        inv.wh_id,
        item.safe_qty,
        inv.bnt,
        (item.safe_qty / NULLIF(inv.bnt, 0)) AS psafe
FROM INVENTORY inv 
JOIN ITEM item
              ON inv.item_id = item.item_id
WHERE 1 = 1
AND item.item_type = '완제품'
OR item.item_type = '반제품'
AND inv.status = '사용가능';
`;
  const params = [];

  if (filters.item_id) {
    sql += "AND inv.item_id = ?";
    params.push(filters.item_id);
  }
  return { sql, params };
};

// 완제품입고 목록
const insertList = (filters) => {
  let sql = `
SELECT i.exam_id,
      i.rsrt_id,
       i.item_id,
       it.item_name,
       it.item_type,
       i.sttus,
       i.exam_qty,
       s.bnt,
       s.his_id
FROM   ITEM_EXAM_HIS i LEFT JOIN (SELECT his_id, bnt
                      FROM   INVENTORY
                     ) s
                  ON   i.exam_id = s.his_id
                       JOIN ITEM it
                       ON   i.item_id = it.item_id
WHERE  i.sttus = '합격'
`;
  const params = [];

  if (filters.item_id) {
    sql += "AND i.item_id = ?";
    params.push(filters.item_id);
  }
  return { sql, params };
};

// 출고관리 목록
const deliveryList = (filters) => {
  let sql = `
 SELECT inv.item_id,
        inv.lot_id,
        inv.vald_date,
       item.item_name,
       inv.bnt
FROM INVENTORY inv JOIN ITEM item
                      ON inv.item_id = item.item_id
WHERE 1=1
AND inv.status = '사용가능' 
`;

  const params = [];
  if (filters.item_id) {
    sql += "AND inv.item_id = ?";
    params.push(filters.item_id);
  }
  return { sql, params };
};

// 완제품 입고
const productUpdate = `
CALL delivery_update(?)
`;

// 출고관리 목록
const setDelivery = (filters) => {
  let sql = `
SELECT ordt.detail_id,
       ordt.item_id,
       item.item_name,
       ord.vend_id,
       vend.vend_name,
       ordt.qty AS order_qty,                                     -- 주문 수량
       COALESCE(SUM(oust.oust_qty), 0) AS delivered_qty,          -- 기납기량
       ordt.qty - COALESCE(SUM(oust.oust_qty), 0) AS overdue_qty  -- 미납기량
FROM ORDER_DETAIL ordt
JOIN ITEM item 
       ON ordt.item_id = item.item_id
JOIN ORDER_INFO ord
       ON ordt.order_id = ord.order_id
JOIN VENDOR vend 
       ON ord.vend_id = vend.vend_id
LEFT JOIN OUST oust 
       ON oust.detail_id = ordt.detail_id
WHERE 1=1

`;

  const params = [];
  if (filters.order_id) {
    sql += "AND ord.order_id = ?";
    params.push(filters.order_id);
  }
  if (filters.vend_id) {
    sql += "AND ord.vend_id = ?";
    params.push(filters.vend_id);
  }

  sql += `
  GROUP BY ordt.detail_id, 
         ordt.item_id, 
         item.item_name, 
         ord.vend_id, 
         vend.vend_name, 
         ordt.qty;
  `;

  return { sql, params };
};

// 입고 관리
const productInsert = `
CALL product_insert(?)
`;

// 모달(생산지시번호)
const prodModal = `
 SELECT inv.lot_id, 
        inv.item_id,
        inv.crea_date,
        item.item_name, 
        inv.wh_id,
        item.safe_qty,
        inv.bnt,
        (item.safe_qty / NULLIF(inv.bnt, 0)) AS psafe
FROM INVENTORY inv 
JOIN ITEM item
                   ON inv.item_id = item.item_id

`;
module.exports = {
  prodModal,
  productList,
  insertList,
  productUpdate,
  setDelivery,
  deliveryList,
  productInsert,
};
