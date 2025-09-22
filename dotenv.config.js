const { config } = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), '.env.local') });

module.exports = config;
