require("dotenv").config();
const { argv } = require("node:process");
const { Pool } = require("pg");

// establish local or remote db here
const dbConnection = argv[2];

module.exports = new Pool({
    connectionString: process.env[`${argv[2]}`]
});
