import 'dotenv/config';
import Agenda from 'agenda';

// MongoDB connection configuration
const mongoConnectionString = process.env.MONGO_URI;
const agenda = new Agenda({ db: { address: mongoConnectionString } });

/**
 * Schedule a task with Agenda
 * @param {string} name - Name of the task
 * @param {string} frequency - Frequency of task execution (e.g., '1 minute')
 * @param {Function} callback - Function to be executed
 * @throws {Error} If scheduling fails
 */
export async function scheduleTask(name, frequency, callback) {
  try {
    // Define the task with high priority
    await agenda.define(name, { priority: 'high' }, async (job, done) => {
      try {
        await callback();
        done();
      } catch (error) {
        done(error);
      }
    });

    // Start agenda and schedule the task
    await agenda.start();
    await agenda.every(frequency, name);
  } catch (error) {
    throw new Error(`Error scheduling task '${name}': ${error.message}`);
  }
}
