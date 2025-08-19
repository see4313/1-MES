const mariadb = require("../database/mapper.js");

const repairHistService = {
  async getAll() {
    const [rows] = await pool.query(mapper.selectRepairHist);
    return rows;
  },

  async create(data) {
    const params = [
      data.REPAIR_HIST_ID,
      data.FAIL_TYPE_CD,
      data.OPERATION_LOG_ID,
      data.REPAIR_DT,
      data.REPAIR_END_DT,
      data.REPAIR_DETAIL,
      data.REPLACED_PART,
      data.POST_REPAIR_STATUS,
      data.REMK,
      data.EMP_ID,
      data.FACILITY_ID,
    ];
    const [result] = await pool.query(mapper.insertRepairHist, params);
    return result;
  },

  async update(id, data) {
    const params = [
      data.FAIL_TYPE_CD,
      data.OPERATION_LOG_ID,
      data.REPAIR_DT,
      data.REPAIR_END_DT,
      data.REPAIR_DETAIL,
      data.REPLACED_PART,
      data.POST_REPAIR_STATUS,
      data.REMK,
      data.EMP_ID,
      data.FACILITY_ID,
      id,
    ];
    const [result] = await pool.query(mapper.updateRepairHist, params);
    return result;
  },

  async remove(id) {
    const [result] = await pool.query(mapper.deleteRepairHist, [id]);
    return result;
  },
};

module.exports = repairHistService;
