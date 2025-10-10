// server.js
const { connectDB, closeDB } = require('./src/config/db');
const createApp = require('./src/app');
const { ensureSeededOnce } = require('./src/services/restaurants.service');

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is missing in environment variables.');
  process.exit(1);
}

const app = createApp();

async function start() {
  try {
    await connectDB(MONGODB_URI, DB_NAME);
    await ensureSeededOnce();
    if (require.main === module) {
      app.listen(PORT, () => console.log(`✅ Server listening on port ${PORT}`));
    }
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

start();

// graceful shutdown
process.on('SIGINT', async () => {
  console.log('🧹 Received SIGINT, shutting down...');
  await closeDB();
  process.exit(0);
});
process.on('SIGTERM', async () => {
  console.log('🧹 Received SIGTERM, shutting down...');
  await closeDB();
  process.exit(0);
});

module.exports = app;
