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
    order by item_id desc;
  `;

  return { sql };
};

const selectPrcsRouter = (query) => {
  let sql =
  `
    select
      p.prcs_name   as prcsName,
      prcs.item_id  as itemId,
      i.item_name   as itemName,
      prcs.op_no    as opNo,
      prcs.prcs_number as prcsNumber
    from PROCESS_ROUTING prcs
    join ITEM i
      on i.item_id = prcs.item_id
    join PROCESS p
      on prcs.prcs_number = p.prcs_number
    where prcs.item_id = ?
    order by prcs.op_no
  `;

  const params = [query.itemId];

  return { sql, params }
};

const savePrcsRouter = (data) => {
  console.log('data', data);
  const sql =
  `
    call sp_sync_process_routing(?, ?);
  `
  const params = [data.itemId, JSON.stringify(data.processes)];
  return { sql, params }
};

module.exports = {
  selectPrcsRouterList,
  selectPrcsRouter,
  savePrcsRouter
};
