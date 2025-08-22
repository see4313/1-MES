// 시작파일
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const publicPath = path.join(__dirname, "public");

const nodeEnv = Boolean(process.env.NODE_ENV);
// 미들웨어
// application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// application/json
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Server 실행 : 서버를 실행하는 app.listen을 기준으로 위쪽에 미들웨어 아래쪽에 라우팅을 세팅
app.listen(3000, () => {
  console.log("Server Start");
  console.log("http://localhost:3000");
});

// 라우팅
const employeeRouter = require("./routers/employee_router.js");
const vendRouter = require("./routers/vend_router.js");
const orderRouter = require("./routers/order_router.js");
const materialRouter = require("./routers/material_router.js");
const inspItemRouter = require("./routers/inspItem_router.js");
const vendorRouter = require("./routers/vendor_router.js");
const productionRouter = require("./routers/productionRouter.js");
const bomRouter = require("./routers/bom_router.js");
const facilityRouter = require("./routers/facility_router.js");
const cleanHistRouter = require("./routers/clean_hist_router.js");
const productRouter = require("./routers/product_router.js");
const warehouseRouter = require("./routers/warehouse_router.js");
const processRouter = require("./routers/process_router.js");
const dashboardRouter = require("./routers/dashboard_router.js");
const inspectHistRouter = require("./routers/inspectHistRouter.js");
const repairHistRouter = require("./routers/repairHistRouter");
const failureTypeRouter = require("./routers/failureTypeRouter");
const downtimeRouter = require("./routers/downtimeRouter");
const urgencyRouter = require("./routers/urgencyRouter");
if (!nodeEnv) {
  console.log(nodeEnv, "개발모드");
  app.use(vendRouter);
  app.use(orderRouter);
  app.use(employeeRouter);
  app.use(materialRouter);
  app.use(inspItemRouter);
  app.use(vendorRouter);
  app.use(productionRouter);
  app.use(bomRouter);
  app.use(facilityRouter);
  app.use(cleanHistRouter);
  app.use(productRouter);
  app.use(warehouseRouter);
  app.use(processRouter);
  app.use(dashboardRouter);
  app.use(inspectHistRouter);
  app.use(repairHistRouter);
  app.use(failureTypeRouter);
  app.use(downtimeRouter);
  app.use(urgencyRouter);
} else {
  console.log(nodeEnv, "운영모드");
  // app.use(`/${apiPath}`, vendRouter);
  // app.use(`/${apiPath}`, orderRouter);
  // app.use(`/${apiPath}`, employeeRouter);
  // app.use(`/${apiPath}`, materialRouter);
  // app.use(`/${apiPath}`, inspItemRouter);
  // app.use(`/${apiPath}`, vendorRouter);
  // app.use(`/${apiPath}`, productionRouter);
  // app.use(`/${apiPath}`, bomRouter);
  // app.use(`/${apiPath}`, facilityRouter);
  // app.use(`/${apiPath}`, cleanHistRouter);
  // app.use(`/${apiPath}`, productRouter);
  // app.use(`/${apiPath}`, warehouseRouter);
  // app.use(`/${apiPath}`, processRouter);
  // app.use(`/${apiPath}`, dashboardRouter);
  // app.use(`/${apiPath}`, inspectHistRouter);
  // app.use(`/${apiPath}`, repairHistRouter);
  // app.use(`/${apiPath}`, failureTypeRouter);
  // app.use(`/${apiPath}`, downtimeRouter);
  // app.use(`/${apiPath}`, urgencyRouter);

  app.use(`/api`, vendRouter);
  app.use(`/api`, orderRouter);
  app.use(`/api`, employeeRouter);
  app.use(`/api`, materialRouter);
  app.use(`/api`, inspItemRouter);
  app.use(`/api`, vendorRouter);
  app.use(`/api`, productionRouter);
  app.use(`/api`, bomRouter);
  app.use(`/api`, facilityRouter);
  app.use(`/api`, cleanHistRouter);
  app.use(`/api`, productRouter);
  app.use(`/api`, warehouseRouter);
  app.use(`/api`, processRouter);
  app.use(`/api`, dashboardRouter);
  app.use(`/api`, inspectHistRouter);
  app.use(`/api`, repairHistRouter);
  app.use(`/api`, failureTypeRouter);
  app.use(`/api`, downtimeRouter);
  app.use(`/api`, urgencyRouter);
}
app.use(express.static(publicPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public", "index.html"));
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "./public", "index.html"));
});
