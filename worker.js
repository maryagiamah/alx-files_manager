import Queue from 'bull';
import dbClient from './utils/db';

const { ObjectId } = require('mongodb');
const imageThumbnail = require('image-thumbnail');
const fs = require('fs');

const fileQueue = new Queue('fileQueue');

fileQueue.process(async (job) => {
  if (!job.data.fileId) throw new Error('Missing fileId');
  if (!job.data.userId) throw new Error('Missing userId');

  const files = dbClient.db.collection('files');

  const file = await files.findOne({
    _id: ObjectId(job.data.fileId),
    userId: ObjectId(job.data.userId),
  });
  if (!file) {
    throw new Error('File not found');
  }

  [500, 250, 100].forEach(async (width) => {
    const fileName = `${file.localPath}_${width}`;
    const options = { width };

    try {
      const thumbnail = await imageThumbnail(file.localPath, options);
      await fs.writeFileSync(fileName, thumbnail);
    } catch (err) {
      // Asuming the err is becuase filepath already has the thumbnails
    }
  });
});

const userQueue = new Queue('userQueue');

userQueue.process(async (job) => {
  if (!job.data.userId) throw new Error('Missing userId');

  const users = dbClient.db.collection('users');
  const user = await users.findOne({
    _id: ObjectId(job.data.userId),
  });

  if (!user) throw new Error('User not found');
  console.log(`Welcome ${user.email}`);
});
