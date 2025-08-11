const boards = require("./sqls/board.js");
const employee = require("./sqls/employee.js");
const vend = require("./sqls/vend.js");
const orders = require("./sqls/order.js");
const materials = require("./sqls/material.js");
<<<<<<< HEAD
const inspitemSqls = require("./sqls/inspitem.js");
=======
const item = require("./sqls/item.js");
>>>>>>> main

module.exports = {
  ...boards,
  ...orders,
  ...materials,
  ...vend,
  ...employee,
<<<<<<< HEAD
  ...inspitemSqls,
=======
  ...item
>>>>>>> main
};
