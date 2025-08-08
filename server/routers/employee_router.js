const express = require("express");
const router = express.Router();
const employeeService = require("../services/employee_service.js");

// /emp/search  사원검색
router.post("/emp/search", employeeService.search);

module.exports = router;
