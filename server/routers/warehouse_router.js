const express = require("express");
const router = express.Router();
const warehouseService = require("../services/warehouse_service.js");

//조회
router.get("/warehouseList", async (req, res, next) => {
  try {
    const rows = await warehouseService.warehouseList(req.query);
    res.json(Array.isArray(rows) ? rows : rows?.rows ?? []);
  } catch (err) {
    next(err);
  }
});

//등록
// 등록
router.post("/warehouses", async (req, res, next) => {
  try {
    const { warehouseName, warehouseLoca, useYn } = req.body || {};

    // 필수값
    if (!warehouseName || !warehouseLoca || !useYn) {
      return res.status(400).json({ message: "필수값을 확인하세요." });
    }

    // 실제 등록
    const result = await warehouseService.warehouseCreate(req.body);
    return res.status(201).json({ message: "등록 완료", result });
  } catch (err) {
    // DB 유니크 제약이 있는 경우도 동일 문구로 반환
    if (err?.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ message: "창고명과 창고 위치가 같으면 중복입니다." });
    }
    return next(err);
  }
});
// 수정 - 단순 체크 (자기 자신 제외)
// 수정 - 부분 업데이트 + 자기 자신 제외 중복 체크(옵션)
router.put("/warehouses/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id)
      return res.status(400).json({ message: "필수값(id)을 확인하세요." });

    // 업데이트 가능한 키만 추출 (undefined 제외)
    const updatable = [
      "warehouseName",
      "warehouseType",
      "warehouseLoca",
      "temp",
      "rh",
      "useYn",
      "remark",
    ];
    const patch = {};
    for (const k of updatable)
      if (req.body[k] !== undefined) patch[k] = req.body[k];

    //
    const result = await warehouseService.warehouseUpdate(id, patch);

    // 영향 행 없음 처리
    if (!result?.affectedRows) {
      return res.status(404).json({ message: "해당 창고를 찾을 수 없습니다." });
    }

    return res.status(200).json({ message: "수정 완료" });
  } catch (err) {
    if (err?.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ message: "창고명과 창고 위치가 같으면 중복입니다." });
    }
    return next(err);
  }
});

// 보관조건 조회
router.get("/whTypes", async (req, res) => {
  let list = await warehouseService.cutdCond();
  res.send(list); // 응답
});

module.exports = router;
