import { EventEmitter } from 'node:events';
import { diContainer } from './di-container';
import { EventData, EventHandler, EventName } from 'app/interfaces/event-bus.interfaces';

export class EventBus {
  private eventEmitter = new EventEmitter();

  public subscribe<Key extends EventName>(eventName: Key, handler: EventHandler<Key>): void {
    this.eventEmitter.on(eventName, handler);
  }

  public unsubscribe<Key extends EventName>(eventName: Key, handler: EventHandler<Key>): void {
    this.eventEmitter.off(eventName, handler);
  }

  public publish<Key extends EventName>(eventName: Key, data: EventData[Key]): void {
    this.eventEmitter.emit(eventName, data);
  }
}

diContainer.registerDependencies(EventBus);