const boards = require("./sqls/board.js");
const employee = require("./sqls/employee.js");

module.exports = {
  ...boards,
  ...employee,
};
