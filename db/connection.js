const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || 'development';

require("dotenv").config({ path: `${__dirname}/../.env.${ENV}` });

let config = {};

if (ENV === "production") {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL not set for production");
  }

  config = {
    connectionString: process.env.DATABASE_URL,
    max: 2,
    ssl: {
      rejectUnauthorized: false, // Required by Supabase
    },
  };
} else {
  if (!process.env.PGDATABASE) {
    throw new Error("PGDATABASE not set for non-production environment");
  }
}

const db = new Pool(config);

console.log(`Connected to database in ${ENV} mode`);
module.exports = db;