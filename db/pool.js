require("dotenv").config();
const { Pool } = require("pg");

module.exports = new Pool({
    connectionString: process.env.LOCAL_DB
});
