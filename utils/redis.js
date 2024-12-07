import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.connect = false;
    this.client = createClient();

    this.client.on('error', (err) => {
      console.log(err);
    });

    this.client.on('ready', () => {
      this.connect = true;
    });
  }

  isAlive() {
    return this.connect;
  }

  async get(key) {
    const asyncGet = promisify(this.client.get).bind(this.client);
    return asyncGet(key);
  }

  async set(key, val, dur) {
    const asyncSet = promisify(this.client.setex).bind(this.client);
    return asyncSet(key, dur, val);
  }

  async del(key) {
    const asyncDel = promisify(this.client.del).bind(this.client);
    return asyncDel(key);
  }
}

const redisClient = new RedisClient();

module.exports = redisClient;
