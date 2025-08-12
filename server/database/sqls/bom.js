// Table : bom, bomdetail

const bomList = `
 SELECT
        b.BOM_NUMBER AS bom_number,
        b.VER        AS ver,
        b.ITEM_ID    AS item_id,
        i.ITEM_NAME  AS item_name,        
        DATE_FORMAT(b.START_DATE,'%Y-%m-%d') AS start_date,
        DATE_FORMAT(b.END_DATE,'%Y-%m-%d')   AS end_date,
        b.\`USE\`        AS use_yn,
        b.REMK       AS remark
      FROM BOM b
      JOIN ITEM i ON i.ITEM_ID = b.ITEM_ID
    ORDER BY b.BOM_NUMBER;`;

const bomDetails = `
  SELECT
    d.BOM_DETAIL_NO AS bom_detail_no,
    d.BOM_NUMBER    AS bom_number,
    d.ITEM_ID       AS item_id,
    i.ITEM_NAME     AS item_name,    
    d.\`USAGE\`         AS \`usage\`,
    d.UNIT          AS unit,
    d.LOSS          AS loss
  FROM BOM_DETAIL d   
  LEFT JOIN ITEM i ON i.ITEM_ID = d.ITEM_ID
  WHERE d.BOM_NUMBER = ?
  ORDER BY d.BOM_DETAIL_NO;
`;
module.exports = {
  bomList,
  bomDetails,
};
