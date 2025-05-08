exports.convertTimestampToDate = (input) => {
  if (!input || typeof input !== 'object') return null; 
  const { created_at, ...otherProperties } = input; 
  if (!created_at) return { ...otherProperties }; 
  return { created_at: new Date(created_at), ...otherProperties }; 
};