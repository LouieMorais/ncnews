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
      rejectUnauthorized: false, // Supabase requires this
    },
  };
} else {
  if (
    !process.env.PGDATABASE ||
    !process.env.PGUSER ||
    !process.env.PGPASSWORD
  ) {
    throw new Error("PGDATABASE, PGUSER or PGPASSWORD not set for dev/test");
  }

  config = {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: "localhost",
    port: 5432,
  };
}

const db = new Pool(config);

console.log(`Connected to database in ${ENV} mode`);
module.exports = db;