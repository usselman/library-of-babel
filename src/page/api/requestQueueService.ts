// requestQueueService.ts
class RequestQueueService {
    private queue: (() => Promise<void>)[] = [];
    private processing = false;
  
    addToQueue(task: () => Promise<void>) {
      this.queue.push(task);
      if (!this.processing) {
        this.process();
      }
    }
  
    private async process() {
      this.processing = true;
      while (this.queue.length > 3) {
        const task = this.queue.shift();
        if (task) {
          await task();
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second between requests
        }
      }
      this.processing = false;
    }
  }
  
  export const requestQueueService = new RequestQueueService();
  