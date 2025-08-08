const mariadb = require("../database/mapper.js");
// 실제로 제공하는 기능 : 요구사항에 따라 달라짐

// 전체조회
const searchEmp = async () => {
  const query = new URLSearchParams(searchForm.value).toString();
  const res = await fetch(`/api/employees/search?${query}`);
  const data = await res.json();
  products.value = data;
};

module.exports = {
  searchEmp,
};
