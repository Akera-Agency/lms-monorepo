import { EventEmitter2 } from 'eventemitter2';
import {
  ActivityCreatedEvent,
  ActivityDeletedEvent,
  ActivityUpdatedEvent,
} from 'src/modules/activities/activity.handler';
import type { NotifyInput } from 'src/modules/notifications/types/types';
import { UserUpdatedEvent } from 'src/modules/users/user.handler';

// Activity event types

// Declare your events and payloads
export type AppEvents = {
  'user:updated': UserUpdatedEvent;
  'notification:enqueue': NotifyInput;
  'activity:created': ActivityCreatedEvent;
  'activity:updated': ActivityUpdatedEvent;
  'activity:deleted': ActivityDeletedEvent;
};

// A small typed layer over EventEmitter2
export class TypedEventBus<Events extends Record<string, unknown>> {
  private ee: EventEmitter2;

  constructor() {
    this.ee = new EventEmitter2({
      wildcard: true,
      delimiter: ':',
      maxListeners: 100,
      newListener: false,
    });
  }

  emit<K extends keyof Events & string>(event: K, payload: Events[K]) {
    this.ee.emit(event, payload);
  }

  async emitAsync<K extends keyof Events & string>(
    event: K,
    payload: Events[K],
  ) {
    await this.ee.emitAsync(event, payload);
  }

  on<K extends keyof Events & string>(
    event: K | `${string}:${'*' | '**'}`,
    listener: (payload: Events[K]) => void | Promise<void>,
  ) {
    this.ee.on(event, listener);
    return () => this.off(event, listener);
  }

  once<K extends keyof Events & string>(
    event: K,
    listener: (payload: Events[K]) => void | Promise<void>,
  ) {
    this.ee.once(event, listener);
  }

  off<K extends keyof Events & string>(
    event: K | `${string}:${'*' | '**'}`,
    listener: (payload: Events[K]) => void | Promise<void>,
  ) {
    this.ee.off(event, listener);
  }

  waitFor<K extends keyof Events & string>(
    event: K,
    options?: { timeout?: number; filter?(p: Events[K]): boolean },
  ): Promise<Events[K] | undefined> {
    return new Promise<Events[K]>((resolve, reject) => {
      let timeoutRef: ReturnType<typeof setTimeout> | undefined;
      const handler = (payload: Events[K]) => {
        const typedPayload = payload as Events[K];
        if (options?.filter && !options.filter(typedPayload)) return;
        if (timeoutRef) clearTimeout(timeoutRef);
        this.ee.off(event, handler);
        resolve(typedPayload);
      };
      this.ee.on(event, handler);
      if (options?.timeout) {
        timeoutRef = setTimeout(() => {
          this.ee.off(event, handler);
          reject(new Error('waitFor timeout'));
        }, options.timeout);
      }
    });
  }
}

// Singleton instance (HMR-safe)
const g = globalThis as unknown as { __eventBus: TypedEventBus<AppEvents> };
export const eventBus: TypedEventBus<AppEvents> =
  g.__eventBus ?? (g.__eventBus = new TypedEventBus<AppEvents>());
