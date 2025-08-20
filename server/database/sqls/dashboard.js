// sqls/dashboard.js
module.exports = {
  dashboard_summary: `
    SELECT 
      (SELECT COUNT(*) FROM facility) AS total,
      (SELECT COUNT(*) FROM facility WHERE status='RUNNING') AS running,
      (SELECT COUNT(*) FROM facility WHERE status='STOPPED') AS stopped,
      (SELECT COUNT(*) FROM facility WHERE status='INSPECT') AS inspect
  `,

  dashboard_failures: `
    SELECT 
      f.facility_name,
      h.failure_type,
      h.urgency,
      h.status
    FROM failure_hist h
    JOIN facility f ON f.facility_id = h.facility_id
    ORDER BY h.reg_dt DESC
    LIMIT 10
  `,

  dashboard_upcoming: `
    SELECT 
      f.facility_name,
      t.task_date AS date,
      t.task_type AS type
    FROM task_plan t
    JOIN facility f ON f.facility_id = t.facility_id
    WHERE t.task_date >= CURDATE()
    ORDER BY t.task_date ASC
    LIMIT 10
  `,
};
