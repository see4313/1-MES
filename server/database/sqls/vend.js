// Table : VENDOR (거래처)

const vend = `
SELECT vend_id,
       biz_number,
       vend_name,
       vend_type,
       address,
       cntinfo,
       psch,
       remk
FROM   VENDOR
`;

module.exports = {
  vend,
};
