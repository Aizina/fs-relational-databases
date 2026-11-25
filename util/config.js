
require('dotenv').config()

const TESTING = process.env.TESTING === 'true'

module.exports = {
  DATABASE_URL: TESTING
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL,
  PORT: process.env.PORT || 3001,
  SECRET: process.env.SECRET,
  TESTING
}
