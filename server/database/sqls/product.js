const productList = (filters) => {
  let sql = `
  SELECT inv.lot_id, 
        inv.item_id,
        inv.crea_date,
        item.item_name, 
        item.item_type,
        inv.wh_id,
        item.safe_qty,
        inv.bnt,
        (item.safe_qty / NULLIF(inv.bnt, 0)) AS psafe
FROM INVENTORY inv 
JOIN ITEM item
              ON inv.item_id = item.item_id
WHERE 1 = 1 AND item.item_type = '반제품' AND item.item_type = '완제품'
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
       ins.pass_qty,
       ins.remk
FROM INSP_ACMSLT ins
JOIN ITEM item ON  ins.item_id = item.item_id
`;

// 완제품 입고
const productInsert = `
INSERT INTO INVENTORY (lot_id, item_id, wh_id, crea_date, vald_date, entebord_qty, bnt, status)
VALUES (next_code('LOT'), ?, ?, ?, ?, ?, ?, ?)
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
  productInsert,
};
