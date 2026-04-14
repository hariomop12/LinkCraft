const { query } = require('./config/db');
const logger = require('./utils/logger');

async function checkTables() {
  try {
    logger.info("Checking database tables...");
    
    // Check urls table
    const tablesResult = await query("SELECT * FROM information_schema.tables WHERE table_name = 'urls'");
    logger.info(`Found ${tablesResult.rows.length} tables named 'urls'`);
    
    // Check columns for urls table
    const columnsResult = await query("SELECT column_name FROM information_schema.columns WHERE table_name = 'urls'");
    logger.info(`Columns in urls table:`);
    columnsResult.rows.forEach(row => logger.info(`- ${row.column_name}`));
    
    process.exit(0);
  } catch (error) {
    logger.error("Error checking tables:", { error: error.message });
    process.exit(1);
  }
}

console.log('Checking tables structure...');
checkTables();