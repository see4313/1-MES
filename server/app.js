// app.js
const express = require('express');
const app = express();

// middleware
// application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// application/json
app.use(express.json());


app.listen(3000, () => {
  console.log('server enable');
});


const boardRouter = require("./routers/board_router.js");
app.use(boardRouter);

// routing
app.get('/', (req, res) => {
  res.send('test');
});

