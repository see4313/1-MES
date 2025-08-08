const orderList = `
SELECT order_id
     , vend_id
     , emp_id
     , ordr
     , ordr_date
     , paprd_date
     , remk
     , st
FROM   ORDER_INFO
`;

module.exports = {
  orderList,
};
