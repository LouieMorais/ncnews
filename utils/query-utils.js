const validSorts = [
  'author', 'title', 'article_id', 'topic',
  'created_at', 'votes', 'article_img_url', 'comment_count'
];

const validOrders = ['asc', 'desc'];

function getValidatedSortBy(sortBy = 'created_at') {
  if (!validSorts.includes(sortBy)) {
    throw { status: 400, msg: 'Invalid sort_by query' };
  }
  return sortBy;
}

function getValidatedOrder(order = 'desc') {
  const lower = order.toLowerCase();
  if (!validOrders.includes(lower)) {
    throw { status: 400, msg: 'Invalid order query' };
  }
  return lower;
}

module.exports = { getValidatedSortBy, getValidatedOrder };
