const mariadb = require("../database/mapper.js");
// 실제로 제공하는 기능 : 요구사항에 따라 달라짐

// 전체조회

// 사원 검색

const p = (v) => (v && v.toString().trim() !== "" ? v : null);

const search = async (req, res) => {
  try {
    const params = [
      req.body.name || null,
      req.body.name || null,
      req.body.department || null,
      req.body.department || null,
      req.body.phone || null,
      req.body.phone || null,
      req.body.status || null,
      req.body.status || null,
      req.body.permName || null,
      req.body.permName || null,
      req.body.joinDate || null,
      req.body.joinDate || null,
      req.body.leavDate || null,
      req.body.leavDate || null,
    ];

    const result = await mariadb.query("selectEmp", params);
    res.json(result);
  } catch (err) {
    console.error("search error:", err);
    res.status(500).send("DB 조회 오류");
  }
};

module.exports = {
  search,
};
