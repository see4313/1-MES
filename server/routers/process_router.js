const express = require("express");
const router = express.Router();
const processService = require("../services/process_service.js");
//조회
router.get("/processList", async (req, res, next) => {
  try {
    const rows = await processService.processList(req.query);
    res.json(Array.isArray(rows) ? rows : rows?.rows ?? []);
  } catch (err) {
    next(err);
  }
});

// 등록
router.post("/process", async (req, res, next) => {
  try {
    const { prcsName, useYn } = req.body || {};
    if (!prcsName || !useYn) {
      return res
        .status(400)
        .json({ message: "필수값(prcsName, useYn)을 확인하세요." });
    }
    const result = await processService.createProcess(req.body);
    res.status(201).json({ message: "등록 완료", result });
  } catch (err) {
    if (err?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "이미 존재하는 공정번호입니다." });
    }
    next(err);
  }
});

// 등록 - 단순 체크
router.post("/warehouses", async (req, res, next) => {
  try {
    const { warehouseName, warehouseLoca, useYn } = req.body || {};

    if (!warehouseName || !warehouseLoca || !useYn) {
      return res.status(400).json({ message: "필수값을 확인하세요." });
    }

    // 중복(창고명+위치)
    const isDup = await warehouseService.existsNameAndLoca(
      warehouseName,
      warehouseLoca
    );
    if (isDup) {
      return res
        .status(409)
        .json({ message: "창고명과 창고 위치가 같으면 중복입니다." });
    }

    const result = await warehouseService.warehouseCreate(req.body);
    return res.status(201).json({ message: "등록 완료", result });
  } catch (err) {
    if (err?.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ message: "창고명과 창고 위치가 같으면 중복입니다." });
    }
    return next(err);
  }
});

//수정
router.put("/process/:prscNo", async (req, res, next) => {
  try {
    const prscNo = req.params.prscNo;
    const { prcsName, useYn } = req.body || {};
    if (!prscNo || !prcsName || !useYn) {
      return res
        .status(400)
        .json({ message: "필수값(prscNo, prcsName, useYn)을 확인하세요." });
    }
    const result = await processService.updateProcess({ prscNo, ...req.body });
    if (!result?.affectedRows) {
      return res.status(404).json({ message: "수정 대상이 없습니다." });
    }
    res.json({ message: "수정 완료", result });
  } catch (err) {
    next(err);
  }
});

//모달
router.get("/processTypes", async (req, res, next) => {
  try {
    const rows = await processService.processTypeList(req.query);
    res.json(Array.isArray(rows) ? rows : rows?.rows ?? []);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
