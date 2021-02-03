const dotenv = require('dotenv');
const result = dotenv.config();

if (result.error) {
  throw result.error;
}
module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOSTNAME,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE_NAME
    }
  },
  test: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOSTNAME,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: 'testdb'
    },
    seeds: {
      directory: './seeds'
    }
  }
};
