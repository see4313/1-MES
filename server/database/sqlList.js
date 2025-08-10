const boards = require("./sqls/board.js");
const employee = require("./sqls/employee.js");
const vend = require("./sqls/vend.js");
const orders = require("./sqls/order.js");
const materials = require("./sqls/material.js");

module.exports = {
  ...boards,
  ...orders,
  ...materials,
  ...vend,
  ...employee,
};
