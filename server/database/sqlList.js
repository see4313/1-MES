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

module.exports = {
  ...orders,
  ...materials,
  ...vend,
  ...employee,
  ...inspitemSqls,
  ...item,
  ...vendor,
  ...badncode,
  ...item,
  ...production,
  ...bom,
  ...facility,
};
