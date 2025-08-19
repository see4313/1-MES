// item.js

const selectItemList = (type) => {

  const typeMap = {
    semi : "반제품",
    finish : "완제품"
  };

  let sql =
  `
    select
      item_id     AS itemId,
      item_name   AS itemName,
      item_type   AS itemType,
      unit,
      spec,
      cutd_cond   AS cutdCond,
      safe_qty    AS safeQty,
      exp_date    AS expDate,
      uon,
      remk
    from ITEM
    where uon = 'Y'
  `;

  const params = [];

  if (type === 'notmaterial') {
    sql += ` and item_type <> ?`;
    params.push("원재료");
  }
  if (typeMap[type]) {
    sql += ` and item_type = ?`;
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
  selectItemListNoRegisteredPrcsRouting
};
