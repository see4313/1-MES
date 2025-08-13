// production.js

const typeMap = {
  semi : "반제품",
  finish : "완제품"
};

const insertProdInstruct = (data) => {

  const { itemType, startDate, goalDate, remark, details } = data;
  const type = typeMap[itemType];
  
  const sql =
  `
    call add_prod_instruct(?, ?, ?, ?, ?, @out_no)
  `;

  const params = [
    type,
    startDate,
    goalDate,
    remark,
    JSON.stringify(details)
  ];
  console.log(params);
  return { sql, params };
};

module.exports = {
  insertProdInstruct
}