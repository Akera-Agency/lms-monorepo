import { Elysia } from 'elysia';
import { eventBus } from '../core/event-bus';

export const eventBusPlugin = new Elysia({ name: 'event-bus' }).decorate(
  'eventBus',
  eventBus
);

declare module 'elysia' {
  interface Elysia {
    eventBus: typeof eventBus;
  }
}
