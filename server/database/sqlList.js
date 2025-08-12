const boards = require("./sqls/board.js");
const vend = require("./sqls/vend.js");
const orders = require("./sqls/order.js");

module.exports = {
  ...boards,
  ...orders,
  ...vend,
  ...facility,

};
