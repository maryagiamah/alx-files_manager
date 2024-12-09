import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = createClient();

    this.client.on('error', (err) => console.log(err));
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    const asyncGet = promisify(this.client.get).bind(this.client);
    const val = await asyncGet(key);
    return val;
  }

  async set(key, val, dur) {
    const asyncSet = promisify(this.client.setex).bind(this.client);
    await asyncSet(key, dur, val);
  }

  async del(key) {
    const asyncDel = promisify(this.client.del).bind(this.client);
    await asyncDel(key);
  }
}

const redisClient = new RedisClient();

module.exports = redisClient;
