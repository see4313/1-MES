const mapper = require("../database/mapper.js");

const repairHistService = {
  async getAll() {
    return await mapper.query("selectRepairHist");
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
      data.URGENCY_ID,
    ];
    return await mapper.query("insertRepairHist", params);
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
      data.URGENCY_ID,
      id,
    ];
    return await mapper.query("updateRepairHist", params);
  },

  async remove(id) {
    return await mapper.query("deleteRepairHist", [id]);
  },
};

module.exports = repairHistService;
