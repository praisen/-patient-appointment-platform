import pkg from 'pg';
const { Pool } = pkg;

const required = (name, v) => {
  if (!v) throw new Error(`Missing env ${name}`);
  return v;
};

const pool = new Pool({
  host: required('DB_HOST', process.env.DB_HOST),
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: required('DB_USER', process.env.DB_USER),
  password: required('DB_PASSWORD', process.env.DB_PASSWORD),
  database: required('DB_NAME', process.env.DB_NAME),
});

export const query = (text, params) => pool.query(text, params);
