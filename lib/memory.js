// lib/memory.js
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function getMemory(userId, agent, lastN = 6) {
  const key = `${userId}::${agent}`;
  try {
    const history = await redis.get(key);
    if (!history || !Array.isArray(history)) return [];
    return history.slice(-lastN);
  } catch (error) {
    console.error('Redis get error:', error);
    return [];
  }
}

export async function setMemory(userId, agent, role, content) {
  const key = `${userId}::${agent}`;
  try {
    const history = await getMemory(userId, agent, 100);
    
    history.push({ role, content, timestamp: Date.now() });
    const trimmed = history.slice(-6);
    
    // Use set with ex option instead of setex for better compatibility
    await redis.set(key, trimmed, { ex: 3600 });
  } catch (error) {
    console.error('Redis set error:', error);
  }
}

export async function clearMemory(userId, agent) {
  const key = `${userId}::${agent}`;
  try {
    await redis.del(key);
  } catch (error) {
    console.error('Redis delete error:', error);
  }
}