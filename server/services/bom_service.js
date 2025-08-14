const mapper = require("../database/mapper");

function normalizeRows(result) {
  if (Array.isArray(result)) {
    if (Array.isArray(result[0]) && result.length === 2) return result[0];
    return result;
  }
  if (result && Array.isArray(result.rows)) return result.rows;
  return [];
}

const listBom = async (filters = {}) => {
  const raw = await mapper.query("selectBomList", filters);
  const rows = normalizeRows(raw);
  return rows;
};

const getBomDetails = async (bomNumber) => {
  try {
    const queryResult = await mapper.query("selectBomDetails", bomNumber);
    const rows = normalizeRows(queryResult);
    return rows;
  } catch (error) {
    return []; // 오류 발생 시 빈 배열 반환
  }
};

// 모달(상세주문)
const itemModal = async () => {
  let list = await mapper.query("itemModal");
  return list;
};

// 단위 조회
const itemUnit = async () => {
  let list = await mapper.query("itemUnit");
  return list;
};

const toNull = (value) => value ?? null;

// toDateStr 함수 정의
const toDateStr = (date) => {
  if (!date) return null;
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const bomInsert = async (item) => {
  // item_id가 없으면 에러를 발생시키는 로직 추가
  if (!item.item_id) {
    throw new Error("ITEM_ID는 필수 입력 항목입니다.");
  }

  const params = [
    toNull(item.item_id),
    toNull(item.use ?? item.use_yn),
    toNull(item.ver),
    toDateStr(item.start_date),
    toDateStr(item.end_date),
    toNull(item.remk),
  ];

  try {
    const resInfo = await mapper.query("bomInsert", params);
    return { result: !!(resInfo && resInfo.affectedRows > 0) };
  } catch (error) {
    console.error("BOM 데이터 삽입 오류:", error);
    throw error;
  }
};

function convertToArray(obj, columns) {
  let result = [];
  for (let column of columns) {
    result.push(obj[column] ?? null);
  }
  return result;
}

module.exports = {
  convertToArray,
  bomInsert,
  listBom,
  getBomDetails,
  itemModal,
  itemUnit,
};
