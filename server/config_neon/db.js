require('dotenv').config();
const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');

const connectionString = process.env.NEXT_PUBLIC_DRIZZLE_DB_URL;

// Add connection logging
console.log('🔄 Attempting to connect to Neon PostgreSQL database...');

const client = postgres(connectionString, {
  onnotice: () => {}, // Disable default notices unless you want them
  connect: {
    log: (message) => console.log('🔌 Database connection event:', message),
  },
});

// Test the connection immediately
(async () => {
  try {
    await client`SELECT 1`;
    console.log('✅ Successfully connected to Neon PostgreSQL database!');
    console.log('🌐 Database server:', connectionString.split('@')[1].split('/')[0]);
  } catch (err) {
    console.error('❌ Failed to connect to Neon PostgreSQL database:');
    console.error(err);
    process.exit(1); // Exit if we can't connect to the database
  }
})();

const db = drizzle(client);

module.exports = db;