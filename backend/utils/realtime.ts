// Имитация системы реального времени
// В реальном приложении используйте WebSockets или SSE

type EventCallback = (data: any) => void;

class RealtimeService {
  private subscribers: Map<string, Map<string, EventCallback>> = new Map();
  
  // Подписка на событие
  subscribe(channel: string, subscriberId: string, callback: EventCallback): void {
    if (!this.subscribers.has(channel)) {
      this.subscribers.set(channel, new Map());
    }
    
    const channelSubscribers = this.subscribers.get(channel)!;
    channelSubscribers.set(subscriberId, callback);
  }
  
  // Отписка от события
  unsubscribe(channel: string, subscriberId: string): void {
    if (this.subscribers.has(channel)) {
      const channelSubscribers = this.subscribers.get(channel)!;
      channelSubscribers.delete(subscriberId);
      
      if (channelSubscribers.size === 0) {
        this.subscribers.delete(channel);
      }
    }
  }
  
  // Публикация события
  publish(channel: string, data: any): void {
    if (this.subscribers.has(channel)) {
      const channelSubscribers = this.subscribers.get(channel)!;
      
      for (const callback of channelSubscribers.values()) {
        // В реальном приложении отправляйте через WebSocket
        setTimeout(() => callback(data), 0);
      }
    }
  }
  
  // Публикация события для конкретного пользователя
  publishToUser(userId: string, event: string, data: any): void {
    const channel = `user:${userId}`;
    this.publish(channel, { event, data });
  }
  
  // Публикация события для совпадения
  publishToMatch(matchId: string, event: string, data: any): void {
    const channel = `match:${matchId}`;
    this.publish(channel, { event, data });
  }
  
  // Публикация события для прямой трансляции
  publishToLiveStream(streamId: string, event: string, data: any): void {
    const channel = `stream:${streamId}`;
    this.publish(channel, { event, data });
  }
}

export const realtimeService = new RealtimeService();