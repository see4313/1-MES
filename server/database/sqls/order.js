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
SELECT ordt.detail_id,
       ordt.order_id,
       tem.item_id,
       tem.spec,
       tem.unit, 
       ordt.qty,
       ordt.amt,
       (qty * amt) as tamt
FROM ORDER_DETAIL ordt JOIN ITEM tem
						ON ordt.item_id = tem.item_id
JOIN ORDER_INFO ord
                ON ord.order_id = ordt.order_id
WHERE ordt.order_id = ?
`;
// 등록
const orderInsert = `
CALL order_procedure(?,?,?,?,?,?,?)
`;

// 주문, 주문상세수정
const setOrder = `
CALL ordUpdate_procedure(?,?,?,?,?,?,?,?)
`;

// 주문상세 단건 삭제
const deleteOrder = `
DELETE FROM ORDER_DETAIL
WHERE detail_id = ?
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
  empModal,
  orderModal,
  detailOrder,
  itemModal,
  setOrder,
  deleteOrder,
  orderInsert,
};
