// 시작파일
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

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
const boardRouter = require("./routers/board_router.js");
const employeeRouter = require("./routers/employee_router.js");
const vendRouter = require("./routers/vend_router.js");
const orderRouter = require("./routers/order_router.js");
const materialRouter = require("./routers/material_router.js");
const vendorRouter = require("./routers/vendor_router.js");

// 기본 라우팅
app.get("/", (req, res) => {
  res.send("Welcome!!");
});

app.use(boardRouter);
app.use(vendRouter);
app.use(orderRouter);
app.use(employeeRouter);
app.use(materialRouter);
app.use(vendorRouter);
