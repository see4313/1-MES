const mapper = require("../database/mapper.js");

const inspectHistService = {
  // 조회
  async list(params) {
    return await mapper.query("inspectHistList", params);
  },

  // 등록
  async insert(data) {
    return await mapper.query("inspectHistInsert", [
      data.operation_log_id,
      data.facility_id2,
      data.inspect_item,
      data.measure_val,
      data.unit_nm,
      data.judge_result,
      data.inspect_dttm,
      data.inspect_std_id,
      data.emp_id,
      data.remk || null,
    ]);
  },

  // 수정
  async update(data) {
    return await mapper.query("inspectHistUpdate", [
      data.facility_id2,
      data.inspect_item,
      data.measure_val,
      data.unit_nm,
      data.judge_result,
      data.inspect_dttm,
      data.inspect_std_id,
      data.emp_id,
      data.remk || null,
      data.inspect_hist_id,
    ]);
  },

  // 삭제
  async delete(id) {
    return await mapper.query("inspectHistDelete", [id]);
  },
};

module.exports = inspectHistService;
