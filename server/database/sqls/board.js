// Table : t_board_board

// 조건없이 전체조회
const selectBoardList = `
SELECT  id
FROM    t_ta

`;

// 등록
const boardInsert = `
INSERT INTO t_board_board (title, writer, content)
VALUES (?, ?, ?)
`;

const test = `
SELECT emp_id
     , emp_name
     , status
     , join_co
     , leavdorm
     , perm
     , dept_id
     , phone
     , remk
FROM   EMPLOYEE
`;

module.exports = {
  selectBoardList,
  boardInsert,
  test,
};
