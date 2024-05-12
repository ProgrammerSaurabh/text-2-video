class JobQueueService {
  constructor() {
    this.queue = [];
    this.running = false;
  }

  addJob(job) {
    this.queue.push(job);
    if (!this.running) {
      this.run();
    }
  }

  async run() {
    this.running = true;

    console.log('Listening jobs now...');

    while (true) {
      while (this.queue.length > 0) {
        const job = this.queue.shift();
        try {
          await job();
        } catch (error) {
          console.error('Error executing job:', error);
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Adjust the interval as needed
    }
  }
}

module.exports = JobQueueService;
