const orderList = (filters) => {
  let sql = `
    SELECT ord.order_id
       , ord.vend_id
       , vend.vend_name
      , ord.emp_id
      , emp.emp_name
      , ord.ordr
      , ord.ordr_date
      , ord.paprd_date
      , ord.remk
      , ord.st
      FROM ORDER_INFO ord JOIN VENDOR vend
                    ON ord.vend_id = vend.vend_id
      JOIN EMPLOYEE emp
                   ON ord.emp_id = emp.emp_id
    WHERE 1=1
`;

  const params = [];
  if (filters.emp_id) {
    sql += "AND ord.emp_id = ?";
    params.push(filters.emp_id);
  }
  if (filters.order_id) {
    sql += "AND ord.order_id = ?";
    params.push(filters.order_id);
  }
  if (filters.ordr_date) {
    sql += "AND ord.ordr_date = ?";
    params.push(filters.ordr_date);
  }
  return { sql, params };
};

// 주문상세
const detailOrder = `
SELECT detail_id,
       order_id,
       item_id,
       qty,
       amt,
       (qty * amt) as tamt
FROM ORDER_DETAIL
WHERE order_id = ?
`;

//주문등록
const orderInsert = `
INSERT INTO ORDER_INFO(order_id, ordr, emp_id, vend_id, ordr_date, paprd_date, remk)
VALUES (next_code('OD'), ?,?,?,?,?,?)
`;

// 모달(담당자)
const empModal = `
SELECT emp.emp_id
      ,emp.emp_name
      ,emp.dept_id
      ,dept.dept_name
      ,emp.perm
FROM EMPLOYEE emp JOIN DEPARTMENT dept
                  ON emp.dept_id = dept.dept_id
WHERE emp.status = '재직'
`;

// 모달(주문)
const orderModal = `
SELECT ord.order_id,
       ord.vend_id,
       ord.ordr,
       ord.emp_id,
       emp.emp_name,
       vend.vend_name,
       ord.ordr_date,
       ord.paprd_date,
       ord.remk,
       ord.st
FROM ORDER_INFO ord JOIN VENDOR vend
                    ON ord.vend_id = vend.vend_id
JOIN EMPLOYEE emp
                   ON ord.emp_id = emp.emp_id
`;

// 모달 (상세주문)
const itemModal = `
SELECT item_id,
       item_name
FROM ITEM 
WHERE item_type = '완제품'
`;

module.exports = {
  orderList,
  orderInsert,
  empModal,
  orderModal,
  detailOrder,
  itemModal,
};
