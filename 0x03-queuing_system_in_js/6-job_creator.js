import kue from 'kue';
import { createClient } from 'redis';

const redisClient = createClient({});
const queue = kue.createQueue({
  redis: {
    host: '127.0.0.1',
    port: 6379,
  }
});

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
function sendNotification(phoneNumber, message) {
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
}

queue.process('push_notification_code', (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message);
  done();
});

// Log when a job fails
queue.on('failed', (job, err) => {
  console.error(`Notification job failed: ${err.message}`);
});

queue.on('completed', (job) => {
  console.log('Notification job completed');
});

job.on('complete', () => {
  console.log('Notification job completed');
});

job.on('failed', (errorMessage) => {
  console.log(`Notification job failed: ${errorMessage}`);
});
