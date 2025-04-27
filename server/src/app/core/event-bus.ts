import { EventEmitter } from 'node:events';
import { diContainer } from './di-container';
import { EventHandler, EventName } from 'app/interfaces/event-bus.interfaces';

export class EventBus {
  private eventEmitter = new EventEmitter();

  public subscribe<T>(eventName: EventName, handler: EventHandler<T>): void {
    this.eventEmitter.on(eventName, handler);
  }

  public unsubscribe<T>(eventName: EventName, handler: EventHandler<T>): void {
    this.eventEmitter.off(eventName, handler);
  }

  public publish<T>(eventName: EventName, data: T): void {
    this.eventEmitter.emit(eventName, data);
  }
}

diContainer.registerDependencies(EventBus);