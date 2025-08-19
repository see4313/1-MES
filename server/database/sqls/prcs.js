// prcs.js

const selectPrcsList = () => {
  let sql =
  `
    select
      prcs_number as prcsNumber,
      prcs_name as prcsName,
      uon,
      remk
    from PROCESS
    where uon = 'Y'
  `;

  return { sql };
};

module.exports = {
  selectPrcsList
}