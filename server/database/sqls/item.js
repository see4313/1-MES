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
      unit        AS unit,
      spec        AS spec,
      cutd_cond   AS cutdCond,
      safe_qty    AS safeQty,
      exp_date    AS expDate,
      uon         AS uon,
      remk        AS remk
    from ITEM
    where 1=1
  `;

  const params = [];

  if (typeMap[type]) {
    sql += ` and item_type = ?`;
    params.push(typeMap[type]);
  }
  
  return { sql, params };
};

module.exports = {
  selectItemList
};
