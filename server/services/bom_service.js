const mapper = require("../database/mapper");

function normalizeRows(result) {
  if (Array.isArray(result)) {
    if (Array.isArray(result[0]) && result.length === 2) return result[0];
    return result;
  }
  if (result && Array.isArray(result.rows)) return result.rows;
  return [];
}

exports.listBom = async (filters = {}) => {
  const raw = await mapper.query("selectBomList", filters);
  const rows = normalizeRows(raw);
  return rows;
};

exports.getBomDetails = async (bomNumber) => {
  console.log("[Service] getBomDetails called with bomNumber:", bomNumber);

  try {
    // mapper.query에 쿼리 이름과 함께 파라미터를 올바르게 전달합니다.
    // 대부분의 mapper 구현은 단일 파라미터를 '?'에 바인딩할 때 객체 대신 값을 직접 받습니다.
    // { bomNumber } 객체 대신 bomNumber 변수를 직접 전달합니다.
    const queryResult = await mapper.query("selectBomDetails", bomNumber);

    console.log("[Service] Raw query result:", queryResult);

    const rows = normalizeRows(queryResult);

    console.log("[Service] Normalized rows:", rows);

    return rows;
  } catch (error) {
    console.error("[Service] Error in getBomDetails:", error);
    return []; // 오류 발생 시 빈 배열 반환
  }
};
