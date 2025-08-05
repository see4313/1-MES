// Table : t_board_board

// 조건없이 전체조회
const selectBoardList = `
SELECT  no
      , title
      , writer
      , content
      , created_date
FROM    t_board_board
ORDER BY no
`;

// 등록
const boardInsert = `
INSERT INTO t_board_board (title, writer, content)
VALUES (?, ?, ?)
`;

module.exports = {
  selectBoardList,
  boardInsert,
};
