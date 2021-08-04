/* global process */
require("dotenv").config();
const { createDBConnection } = require("./services/database");

const DB_PATH = process.env.DB_PATH || "database.db";

const db = createDBConnection(DB_PATH);

module.exports = db;
