const boards = require("./sqls/board.js");
const orders = require("./sqls/order.js");

module.exports = {
  ...boards,
  ...orders,
};
