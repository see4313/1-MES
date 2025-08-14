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

module.exports = {
  selectItemList
};
