// item.js

const selectItemList = (type) => {

  const typeMap = {
    semi : "반제품",
    finish : "완제품"
  };

  let sql =
  `
SELECT
    i.item_id     AS itemId,
    i.item_name   AS itemName,
    i.item_type   AS itemType,
    i.unit,
    i.spec,
    i.cutd_cond   AS cutdCond,
    i.safe_qty    AS safeQty,
    i.exp_date    AS expDate,
    i.uon,
    i.remk
  FROM ITEM i
  WHERE i.uon = 'Y'
    AND EXISTS (
        SELECT 1
        FROM PROCESS_ROUTING pr
        WHERE pr.item_id = i.item_id
    )
  `;

  const params = [];

  if (type === 'notmaterial') {
    sql += ` and i.item_type <> ?`;
    params.push("원재료");
  }
  if (typeMap[type]) {
    sql += ` and i.item_type = ?`;
    params.push(typeMap[type]);
  } 
  
  console.log(sql, params);
  return { sql, params };
};

const selectPrcsItemList = (type) => {

  const typeMap = {
    semi : "반제품",
    finish : "완제품"
  };

  let sql =
  `
SELECT
    i.item_id     AS itemId,
    i.item_name   AS itemName,
    i.item_type   AS itemType,
    i.unit,
    i.spec,
    i.cutd_cond   AS cutdCond,
    i.safe_qty    AS safeQty,
    i.exp_date    AS expDate,
    i.uon,
    i.remk
  FROM ITEM i
  WHERE i.uon = 'Y'
  `;

  const params = [];

  if (type === 'notmaterial') {
    sql += ` and i.item_type <> ?`;
    params.push("원재료");
  }
  if (typeMap[type]) {
    sql += ` and i.item_type = ?`;
    params.push(typeMap[type]);
  } 
  
  console.log(sql, params);
  return { sql, params };
};

const selectItemListNoRegisteredPrcsRouting = () => {
  const sql = `
    select
      i.item_id     AS itemId,
      i.item_name   AS itemName,
      i.item_type   AS itemType,
      i.unit,
      i.spec,
      i.cutd_cond   AS cutdCond,
      i.safe_qty    AS safeQty,
      i.exp_date    AS expDate,
      i.uon,
      i.remk
    from ITEM i
    where not exists (
      select 1
      from PROCESS_ROUTING pr
      where pr.item_id = i.item_id
    )
  `
  return { sql };
}

module.exports = {
  selectItemList,
  selectPrcsItemList,
  selectItemListNoRegisteredPrcsRouting
};
