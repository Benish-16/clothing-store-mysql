
function getPagination(page, limit) {
  const pageNumber = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 10;
  const offset = (pageNumber - 1) * pageSize;
  return { pageNumber, pageSize, offset };
}

module.exports = { getPagination };
