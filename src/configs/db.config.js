const dotenv = require('dotenv');
const result = dotenv.config();

if (result.error) {
  throw result.error;
}
// database connection options for knex
const options = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOSTNAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE_NAME
  }
};

module.exports = {
  options: options
};
