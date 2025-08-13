// 전체 + LIKE 필터(비어있으면 전체)
const BOM_LIST = `
  SELECT
    b.BOM_NUMBER                          AS bom_number,
    b.ITEM_ID                             AS item_id,
    b.\`USE\`                              AS use_yn,
    b.VER                                 AS ver,
    DATE_FORMAT(b.START_DATE, '%Y-%m-%d') AS start_date,
    DATE_FORMAT(b.END_DATE,   '%Y-%m-%d') AS end_date,
    b.REMK                                AS remark,
    i.ITEM_NAME                           AS item_name
  FROM BOM b
  LEFT JOIN ITEM i ON i.ITEM_ID = b.ITEM_ID
  WHERE 1=1
    AND (COALESCE(?, '') = '' OR b.BOM_NUMBER LIKE CONCAT('%', ?, '%'))
    AND (COALESCE(?, '') = '' OR i.ITEM_NAME  LIKE CONCAT('%', ?, '%'))
    AND (COALESCE(?, '') = '' OR b.ITEM_ID    LIKE CONCAT('%', ?, '%'))
    AND (COALESCE(?, '') = '' OR b.VER        LIKE CONCAT('%', ?, '%'))
    AND (COALESCE(?, '') = '' OR b.\`USE\`      = ?)
  ORDER BY b.BOM_NUMBER DESC
`;

const BOM_DETAILS = `
  SELECT
    d.BOM_DETAIL_NO AS bom_detail_no,
    d.BOM_NUMBER    AS bom_number,
    d.ITEM_ID       AS item_id,
    i.ITEM_NAME     AS item_name,
    d.\`USAGE\`      AS \`usage\`,
    d.UNIT          AS unit,
    d.LOSS          AS loss
  FROM BOM_DETAIL d
  LEFT JOIN ITEM i ON i.ITEM_ID = d.ITEM_ID
  WHERE d.BOM_NUMBER = ?
  ORDER BY d.BOM_DETAIL_NO
`;

module.exports = { BOM_LIST, BOM_DETAILS };
