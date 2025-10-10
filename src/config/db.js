// src/config/db.js
const mongoose = require('mongoose');

async function connectDB(uri, dbName) {
  console.log('🚀 Connecting to MongoDB...');
  console.log('🔗 URI (hidden):', uri ? uri.slice(0, 40) + '...' : '❌ Missing');
  console.log('📦 DB Name:', dbName);

  try {
    await mongoose.connect(uri, {
      dbName,
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅ [MongoDB] connected: ${mongoose.connection.name}`);
  } catch (err) {
    console.error('❌ [MongoDB] connection failed:', err.message);
    console.error(err);
    throw err; // server.js에서 잡힘
  }
}

async function closeDB() {
  try {
    await mongoose.connection.close(false);
    console.log('[MongoDB] connection closed');
  } catch (err) {
    console.error('[MongoDB] error on close:', err);
  }
}

module.exports = { connectDB, closeDB };