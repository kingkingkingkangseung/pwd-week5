// jest.setup.js
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

beforeAll(async () => {
  // MongoDB 메모리 서버 시작
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Mongoose 연결
  await mongoose.connect(uri, {
    dbName: 'test-db',
    autoIndex: false,
  });
}, 30000); // 30초 타임아웃

afterAll(async () => {
  // 모든 테스트 완료 후 정리
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongoServer) {
    await mongoServer.stop();
  }
}, 30000);

afterEach(async () => {
  // 각 테스트 후 컬렉션 정리 (옵션)
  // resetStore()를 사용하므로 여기서는 불필요
});