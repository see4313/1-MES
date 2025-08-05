// boards.js

// Read
const selectBoardList = `
select no
        , name
        , writer
        , publisher
        , publication_date
        , info
from t_book_board
order by no
`;

// Create
const boardInsert = `
insert into t_book_board (name, writer, info)
values (?, ?, ?)
`;

module.exports = {
  selectBoardList,
  boardInsert
}