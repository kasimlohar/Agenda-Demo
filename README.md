# Agenda.js Task Scheduler Demo

A demonstration project showing how to implement job scheduling in Node.js applications using Agenda.js. This project is inspired by the BetterStack guide on [scaling Node.js scheduled tasks](https://betterstack.com/community/guides/scaling-nodejs/node-scheduled-tasks/).

## About Agenda.js

Agenda.js is a lightweight job scheduling library for Node.js that allows you to schedule tasks (jobs) to run at specific times or intervals. It uses MongoDB to persist job data, making it reliable and scalable.

## Prerequisites

Before running this project, ensure you have the following installed:

- Node.js (v20.10.0 or higher)
- npm (v10.2.3 or higher)
- MongoDB (running locally or accessible via URL)

## Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd agenda-demo
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
- Create a `.env` file in the project root
- Add your MongoDB connection string:
```
MONGO_URI=mongodb://localhost/agendaDB
```

## Usage

### Basic Setup

```javascript
import Agenda from 'agenda';
import 'dotenv/config';

const agenda = new Agenda({ db: { address: process.env.MONGO_URI } });

// Define a job
agenda.define('welcomeMessage', () => {
  console.log('Welcome message job executed!');
});

// Start Agenda
await agenda.start();

// Schedule the job
await agenda.every('5 seconds', 'welcomeMessage');
```

### Running the Project

1. Start your MongoDB server
2. Run the application:
```bash
npm start
```

## Schedule Formats

Agenda supports various scheduling formats:

- Every N seconds: `'1 second'`
- Every N minutes: `'2 minutes and 15 seconds'`
- Every N hours: `'2 hours and 30 minutes'`
- Daily/Weekly: `'3 days'`, `'3 weeks'`
- Monthly: `'1 month and 2 weeks'`
- Yearly: `'2 years and 6 months'`

## Configuration & Debugging

### Job Priority

Set job priorities using the priority option:
```javascript
agenda.define('highPriorityJob', { priority: 'high' }, async (job) => {
  // Job logic here
});
```

### Job Management

- List all jobs:
```javascript
const jobs = await agenda.jobs({});
```

- Cancel specific jobs:
```javascript
await agenda.cancel({ name: 'jobName' });
```

- Enable/Disable jobs:
```javascript
await agenda.disable({ name: 'jobName' });
await agenda.enable({ name: 'jobName' });
```

## Best Practices

1. Always handle job errors properly
2. Use job priorities for important tasks
3. Implement proper logging and monitoring
4. Keep job definitions modular and maintainable
5. Use environment variables for configuration

## Additional Resources

- [Agenda.js Documentation](https://github.com/agenda/agenda)
- [Original BetterStack Guide](https://betterstack.com/community/guides/scaling-nodejs/node-scheduled-tasks/)

## License

This project is licensed under the Apache License, Version 2.0. See the [LICENSE](LICENSE) file for details.
