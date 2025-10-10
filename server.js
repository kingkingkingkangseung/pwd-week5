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

const cors = require('cors');
const express = require('express');
const createApp = require('./src/app');

const app = createApp();

// ✅ CORS 허용 설정
app.use(cors({
  origin: [
    'https://pwd-week3-kingkingkingkangseung.netlify.app', // Netlify 프론트엔드 주소
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

async function start() {
  try {
    console.log("🔍 process.env.MONGODB_URI:", process.env.MONGODB_URI ? "✅ Loaded" : "❌ Missing");
    console.log("🟢 Trying to connect to MongoDB...");
    await connectDB(process.env.MONGODB_URI, process.env.DB_NAME);
    console.log("🟢 MongoDB connection attempt finished");

    await ensureSeededOnce();
    if (require.main === module) {
      app.listen(PORT, () => console.log(`✅ Server listening on port ${PORT}`));
    }
  } catch (err) {
    console.error("❌ Failed to start server!");
    console.error(err); // 🔥 여기서 에러 전체 출력
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
