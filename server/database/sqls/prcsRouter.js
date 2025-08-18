// prcsRouter.js

const selectPrcsRouterList = () => {
  let sql =
  `
    select
      i.item_id as itemId,
      i.item_name as itemName
    from ITEM i
    where exists (
      select 1
      from PROCESS_ROUTING p
      where p.item_id = i.item_id  
    )
  `;

  return { sql };
};

const selectPrcsRouter = (query) => {
  let sql =
  `
    select
      prcs.item_id as itemId,
      i.item_name as itemName,
      prcs.op_no as opNo,
      prcs.prcs_number as prcsNumber
    from ITEM i
    join PROCESS_ROUTING prcs
    on i.item_id = prcs.item_id
    where prcs.item_id = ?
  `;

  const params = [query.itemId];

  return { sql, params }
};

module.exports = {
  selectPrcsRouterList,
  selectPrcsRouter
};
