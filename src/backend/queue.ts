interface QueueItem {
  id: string;
  timestamp: number;
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}

class RequestQueue {
  private queue: QueueItem[] = [];
  private isProcessing = false;
  private currentRequestId: string | null = null;

  async addToQueue(): Promise<{ queueId: string; position: number }> {
    const queueId = Math.random().toString(36).substring(2, 15);
    const queueItem: QueueItem = {
      id: queueId,
      timestamp: Date.now(),
      resolve: () => {},
      reject: () => {},
    };

    this.queue.push(queueItem);
    const position = this.queue.length;

    if (!this.isProcessing) {
      this.processNext();
    }

    return { queueId, position };
  }

  async waitForTurn(queueId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const checkTurn = () => {
        if (this.currentRequestId === queueId) {
          resolve();
        } else {
          setTimeout(checkTurn, 1000);
        }
      };
      checkTurn();
    });
  }

  private processNext() {
    if (this.queue.length === 0) {
      this.isProcessing = false;
      this.currentRequestId = null;
      return;
    }

    this.isProcessing = true;
    const nextItem = this.queue.shift()!;
    this.currentRequestId = nextItem.id;
  }

  completeRequest(queueId: string) {
    if (this.currentRequestId === queueId) {
      this.currentRequestId = null;
      this.isProcessing = false;
      setTimeout(() => this.processNext(), 100);
    }
  }

  getQueueStatus(queueId?: string) {
    const queueLength = this.queue.length;
    const isProcessing = this.isProcessing;
    let position = 0;
    
    if (queueId) {
      const index = this.queue.findIndex(item => item.id === queueId);
      position = index !== -1 ? index + 1 : 0;
    }
    
    const isCurrentlyProcessing = this.currentRequestId === queueId;

    return {
      queueLength,
      isProcessing,
      position,
      isCurrentlyProcessing,
      currentRequestId: this.currentRequestId,
    };
  }
}

export const globalQueue = new RequestQueue();