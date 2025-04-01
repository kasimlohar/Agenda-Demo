import 'dotenv/config';
import Agenda from 'agenda';

// Initialize MongoDB connection
const mongoConnectionString = process.env.MONGO_URI;
const agenda = new Agenda({ db: { address: mongoConnectionString } });

// Define example jobs
// 1. Basic welcome message job
agenda.define('welcomeMessage', () => {
  console.log('Sending a welcome message every few seconds');
});

// 2. High priority data export job
agenda.define('dataExport', { priority: 'high'}, (job) => {
  const { name, path } = job.attrs.data;
  console.log(`Exporting data for ${name} to ${path}`);
});

// 3. Low priority email reminder job
agenda.define("emailReminder", { priority: "low" }, async (job) => {
  const { email } = job.attrs.data;
  console.log(`Sending email reminder to ${email}`);
});

// Start the agenda scheduler
await agenda.start();

// Schedule jobs with different intervals
await agenda.every('5 seconds', 'welcomeMessage');
await agenda.every('5 seconds', 'dataExport', { 
  name: 'John Doe', 
  path: '/path/to/export' 
});

// Example of different scheduling methods
// Schedule for future execution
await agenda.schedule('tomorrow at noon', 'dataExport', {
  name: 'Kasim Lohar', 
  path: '/path/to/export'
});

// Execute immediately
await agenda.now('welcomeMessage');

// Job management examples
// await agenda.cancel({ name: 'dataExport' });
await agenda.disable({ name: 'dataExport' });
await agenda.enable({ name: 'dataExport' });

// Utility function to list all jobs
async function listJobs() {
  const jobs = await agenda.jobs({});
  jobs.forEach((job) => {
    console.log(
      `Job ID: ${job.attrs._id}, Name: ${
        job.attrs.name
      }, Data: ${JSON.stringify(job.attrs.data)}`
    );
  });
}

listJobs();
