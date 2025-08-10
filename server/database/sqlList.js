const boards = require("./sqls/board.js");
const orders = require("./sqls/order.js");
const materials = require("./sqls/material.js");

module.exports = {
  ...boards,
  ...orders,
  ...materials,
};
