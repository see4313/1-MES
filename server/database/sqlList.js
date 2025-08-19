const employee = require("./sqls/employee.js");
const vend = require("./sqls/vend.js");
const orders = require("./sqls/order.js");
const materials = require("./sqls/material.js");
const inspitemSqls = require("./sqls/inspitem.js");
const item = require("./sqls/item.js");
const production = require("./sqls/production.js");
const vendor = require("./sqls/vendor.js");
const badncode = require("./sqls/badncode.js");
const bom = require("./sqls/bom.js");
const facility = require("./sqls/facility.js");
const cleanHist = require("./sqls/cleanHist.js");
const product = require("./sqls/product.js");
const warehouse = require("./sqls/warehouse.js");
const process = require("./sqls/process.js");
const prcsRouter = require("./sqls/prcsRouter.js");
const prcs = require("./sqls/prcs.js");

module.exports = {
  ...orders,
  ...materials,
  ...vend,
  ...employee,
  ...inspitemSqls,
  ...item,
  ...production,
  ...vendor,
  ...badncode,
  ...bom,
  ...facility,
  ...cleanHist,
  ...product,
  ...warehouse,
  ...process,
  ...prcsRouter,
  ...prcs
};
