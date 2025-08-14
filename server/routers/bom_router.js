// server/routers/bom_router.js
const express = require("express");
const router = express.Router();
const bomService = require("../services/bom_service");

// 목록
router.get("/bom", async (req, res) => {
  console.log("[API] GET /bom", Object.assign({}, req.query));
  try {
    const rows = await bomService.listBom(req.query || {});
    res.set("Cache-Control", "no-store");
    res.status(200).json(Array.isArray(rows) ? rows : []);
  } catch (err) {
    console.error("[BOM LIST ERROR]", err);
    res.status(500).json({ message: String(err?.message || err) });
  }
});

// 상세
router.get("/bom/:bomNumber/details", async (req, res) => {
  console.log("[API] GET /bom/:bomNumber/details", req.params.bomNumber);
  try {
    const rows = await bomService.getBomDetails(req.params.bomNumber);
    res.set("Cache-Control", "no-store");
    res.status(200).json(Array.isArray(rows) ? rows : []);
  } catch (err) {
    console.error("[BOM DETAILS ERROR]", err);
    res.status(500).json({ message: String(err?.message || err) });
  }
});

//품목
router.get("/item", async (req, res) => {
  try {
    const { item_name } = req.query;
    const items = await bomService.itemModal({ item_name });
    res.status(200).json(items);
  } catch (err) {
    console.error("[ITEM LIST ERROR]", err);
    res.status(500).json({ message: "품목 목록 조회 오류" });
  }
});

// 단위 조회
router.get("/unit", async (req, res) => {
  let list = await bomService.itemUnit();
  res.send(list); // 응답
});

//등록

router.post("/bomInsert", async (req, res) => {
  // 클라이언트에서 보낸 객체를 구조 분해 할당하여 키 이름을 통일
  const { itemId, use, use_yn, ver, startDate, endDate, remk } = req.body;

  // 'itemId'가 존재하는지 유효성 검사
  if (!itemId) {
    return res.status(400).json({
      error: "itemId는 필수 입력 항목입니다.",
    });
  }

  // 서비스 함수에 전달할 객체를 새로 생성하여 키 이름 통일
  const item = {
    item_id: itemId,
    use: use ?? use_yn,
    ver: ver,
    start_date: startDate,
    end_date: endDate,
    remk: remk,
  };

  try {
    const result = await bomService.bomInsert(item);
    res.status(201).send(result);
  } catch (error) {
    console.error("BOM 데이터 삽입 중 오류 발생:", error);
    res.status(500).json({
      error: "서버에서 BOM 데이터를 처리하는 중 오류가 발생했습니다.",
    });
  }
});
module.exports = router;
