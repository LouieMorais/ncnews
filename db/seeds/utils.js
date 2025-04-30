// const db = require("../../db/connection");

// exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
//   if (!created_at) return { ...otherProperties };
//   return { created_at: new Date(created_at), ...otherProperties };
// };

// git commit --no-verify -m "Your commit message"


exports.convertTimestampToDate = (timestamp) => {
  if (timestamp === null || timestamp === undefined) {
     return null;
  }
  const numericTimestamp = Number(timestamp);
  if (isNaN(numericTimestamp)) {
    return null; 
  }
  return new Date(numericTimestamp);
};
