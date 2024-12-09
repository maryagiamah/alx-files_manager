import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  static getStatus(req, res) {
    if (redisClient.isAlive() && dbClient.isAlive()) {
      res.status(200).send({ redis: true, db: true });
    }
  }

  static getStats(req, res) {
    const users = dbClient.nbUsers();
    const files = dbClient.nbFiles();

    res.status(200).send({ users, files });
  }
}

module.exports = AppController;
