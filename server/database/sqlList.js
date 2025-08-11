const boards = require("./sqls/board.js");
const employee = require("./sqls/employee.js");
const vend = require("./sqls/vend.js");
const orders = require("./sqls/order.js");
const materials = require("./sqls/material.js");
const inspitemSqls = require("./sqls/inspitem.js");
const vendor = require("./sqls/vendor.js");
const item = require("./sqls/item.js");

module.exports = {
  ...boards,
  ...orders,
  ...materials,
  ...vend,
  ...employee,
  ...inspitemSqls,
  ...vendor,
  ...item
};
