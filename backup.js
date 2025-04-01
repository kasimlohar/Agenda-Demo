import { spawn } from 'child_process';
import { format } from 'date-fns';
import { scheduleTask } from './schedule.js';

// Database configuration
const dbName = 'agendaDB';
const compressionType = '--gzip';

/**
 * Get current datetime in formatted string
 * @returns {string} Formatted datetime string
 */
const getFormattedDateTime = () => {
  return format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
};

/**
 * Execute database backup
 * @returns {Promise<void>}
 * @throws {Error} If backup process fails
 */
const backupDatabase = async () => {
  return new Promise((resolve, reject) => {
    const currentDateTime = getFormattedDateTime();
    const backupFileName = `./backup-${currentDateTime}.gz`;

    console.log(`Starting database backup: ${backupFileName}`);

    const backupProcess = spawn('mongodump', [
      `--db=${dbName}`,
      `--archive=${backupFileName}`,
      compressionType,
    ]);

    // Error handling
    backupProcess.on('error', (err) => {
      reject(new Error(`Failed to start backup process: ${err.message}`));
    });

    // Process completion handling
    backupProcess.on('exit', (code, signal) => {
      if (code) {
        reject(new Error(`Backup process exited with code ${code}`));
      } else if (signal) {
        reject(new Error(`Backup process was terminated with signal ${signal}`));
      } else {
        console.log(`Database "${dbName}" successfully backed up to ${backupFileName}`);
        resolve();
      }
    });
  });
};

/**
 * Main backup execution function with heartbeat monitoring
 */
async function runBackup() {
  try {
    await backupDatabase();
    const response = await fetch(process.env.HEARTBEAT_URL);
    if (!response.ok) throw new Error(response.statusText);
  } catch (err) {
    console.error(`Error while backing up DB: ${err}`);
  }
}

// Schedule backup task
try {
  await scheduleTask('backupMongoDB', '1 minute', runBackup);
  console.log('Backup task scheduled successfully');
} catch (err) {
  console.error(`Failed to schedule backup task: ${err}`);
}
