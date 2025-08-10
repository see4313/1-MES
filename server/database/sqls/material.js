const inventoryList = (filters) => {
  let sql = `
    SELECT lot_id
         , item_id
         , wh_id
         , crea_date
         , vald_date
         , field
         , field2
         , bnt
         , status
         , remk
    FROM   INVENTORY
    WHERE  1=1
  `;

  const params = [];

  if (filters.item_id) {
    sql += " AND item_id = ?";
    params.push(filters.item_id);
  }
  if (filters.wh_id) {
    sql += " AND wh_id = ?";
    params.push(filters.wh_id);
  }
  if (filters.lot_id) {
    sql += " AND lot_id = ?";
    params.push(filters.lot_id);
  }

  return { sql, params };
};

module.exports = {
  inventoryList,
};
