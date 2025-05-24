// server/redis/index.ts
import { createClient } from 'redis';
import dotenv from 'dotenv';

// 1) Load .env into process.env
dotenv.config();

// 2) Detect environment
const isProd = process.env.NODE_ENV === 'production';

// 3) Build connection options
const clientOptions = isProd
  ? { url: process.env.REDIS_URL! } // In prod, expect REDIS_URL set
  : {
      socket: {
        host: process.env.REDIS_HOST ?? '127.0.0.1', // Dev defaults
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    };

// 4) Instantiate & connect
const redis = createClient(clientOptions);

redis.on('error', (err) => {
  console.error('❌ Redis Client Error', err);
});

(async () => {
  try {
    await redis.connect();
    console.log(
      `✅ Connected to Redis (${isProd ? 'production' : 'development'})`
    );
  } catch (err) {
    console.error('⚠️ Failed to connect to Redis', err);
  }
})();

export default redis;
