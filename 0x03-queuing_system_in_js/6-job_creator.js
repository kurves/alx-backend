import kue from 'kue';
import { createClient } from 'redis';

const redisClient = createClient({});
const queue = kue.createQueue({
  redis: {
    host: '127.0.0.1',
    port: 6379,
  }
});
//const queue = kue.createQueue({ redis: redisClient });

const jobData = {
  phoneNumber: '1234567890',
  message: 'Hello from Kue!'
};

const job = queue.create('push_notification_code', jobData)
  .save((err) => {
    if (err) {
      console.error(`Error creating job: ${err.message}`);
    } else {
      console.log(`Notification job created: ${job.id}`);
    }
  });
job.on('complete', () => {
  console.log('Notification job completed');
});

job.on('failed', (errorMessage) => {
  console.log(`Notification job failed: ${errorMessage}`);
});
