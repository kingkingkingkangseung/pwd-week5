// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, closeDB } = require('./src/config/db');
const createApp = require('./src/app');
const { ensureSeededOnce } = require('./src/services/restaurants.service');

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

// ✅ 환경변수 확인
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is missing in environment variables.');
  process.exit(1);
}

// ✅ Express App 생성
const app = createApp();

// ✅ CORS 허용 설정
app.use(cors({
  origin: [
    'https://pwd-week3-kingkingkingkangseung.netlify.app', // 프론트엔드 주소
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// ✅ 서버 시작 함수
async function start() {
  try {
    console.log("🔍 process.env.MONGODB_URI:", process.env.MONGODB_URI ? "✅ Loaded" : "❌ Missing");
    console.log("🟢 Trying to connect to MongoDB...");
    await connectDB(MONGODB_URI, DB_NAME);
    console.log("✅ [MongoDB] Connected successfully");

    await ensureSeededOnce();
    if (require.main === module) {
      app.listen(PORT, () => console.log(`✅ Server listening on port ${PORT}`));
    }
  } catch (err) {
    console.error("❌ Failed to start server!");
    console.error(err);
    process.exit(1);
  }
}

// ✅ 서버 실행
start();

// ✅ graceful shutdown
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
