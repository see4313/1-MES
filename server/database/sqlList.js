const boards = require("./sqls/board.js");
const vend = require("./sqls/vend.js");

module.exports = {
  ...boards,
  ...vend,
};
