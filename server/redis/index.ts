import Redis from 'ioredis';

const isProd = process.env.NODE_ENV === 'production';

const redis = isProd
  ? new Redis(process.env.REDIS_URL as string)
  : new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      // password: process.env.REDIS_PASSWORD,
    });

export const pub = redis.duplicate();
export const sub = redis.duplicate();

export default redis;
