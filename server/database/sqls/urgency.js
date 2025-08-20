module.exports = {
  selectUrgencyList: `
    SELECT URGENCY_ID   AS urgency_id,
           URGENCY_NAME AS urgency_name,
           URGENCY_LVL  AS urgency_lvl
      FROM URGENCY
     WHERE IS_ACTIVE = 'Y'
     ORDER BY URGENCY_LVL
  `,
};
