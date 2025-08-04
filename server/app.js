require("dotenv").config({ path: "./database/configs/dbConfig.env" });
const express = require("express");
const cors = require("cors");
const app = express();

//라우팅 등록
const basicRouter = require("./routers/basic_router.js");
const faciltyRouter = require("./routers/facilty_router.js");
const materialRouter = require("./routers/material_router.js");
const productionRouter = require("./routers/production_router.js");
const qualityRouter = require("./routers/quality_router.js");
const salesRouter = require("./routers/sales_router.js");

//서버실행
app.listen(3000, () => {
  console.log("Server Start");
  console.log("http://localhost:3000");
});

app.use(express.json());
app.use(cors());

// 라우터 모듈 등록
app.use("/basic", basicRouter);
app.use("/facility", faciltyRouter);
app.use("/material", materialRouter);
app.use("/production", productionRouter);
app.use("/quality", qualityRouter);
app.use("/sales", salesRouter);
