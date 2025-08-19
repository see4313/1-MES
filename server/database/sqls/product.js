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
`;
  const params = [];

  if (filters.item_id) {
    sql += "AND inv.item_id = ?";
    params.push(filters.item_id);
  }
  return { sql, params };
};

// 완제품입고 목록
const insertList = `
SELECT item.item_id,
	   item.item_name,
       item.item_type,
       his.rsrt_id,
	     prod.remk,
       prod.prod_qty,
       his.exam_id
FROM ITEM item JOIN ITEM_EXAM_HIS his 
                    ON item.item_id = his.item_id
JOIN PROD_ACMSLT prod
                    ON  prod.rsrt_id = his.rsrt_id
WHERE 1 = 1
AND item.item_type = '완제품'

`;

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
       vend.vend_name
FROM ORDER_DETAIL ordt
JOIN ITEM item 
                ON ordt.item_id = item.item_id
JOIN ORDER_INFO ord
                ON ordt.order_id = ord.order_id
JOIN VENDOR vend 
                ON ord.vend_id = vend.vend_id
WHERE 1=1 
`;

  const params = [];
  if (filters.item_id) {
    sql += "AND ord.item_id = ?";
    params.push(filters.item_id);
  }
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
