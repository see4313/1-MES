// board_router.js
const express = require('express');
const router = express.Router();

const boardService = require("../service/board_service.js");

// 라우터는 아무리 길어도 7~10줄 안넘김

// router
router.get('/boards', async (req, res) => {
  let list = await boardService.findAll();
  res.send(list);
});

router.post('/boards', async (req, res) => {
  let board = req.body;
  let result = await boardService.addNew(board);
  res.send(result);
});

module.exports = router;