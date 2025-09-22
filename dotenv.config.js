const { config } = require("dotenv");
const path = require("node:path");

// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), ".env.local") });

module.exports = config;
