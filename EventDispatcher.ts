import { EventHandler } from "./types";

export const DOM_EVENT = ['click', 'clickOutside', 'mouseup', 'mousedown', 'mousemove', 'dblclick'] as const

export type MouseType = typeof DOM_EVENT[number]

export class EventDispatcher<T extends string = MouseType, E extends any = MouseEvent> {
  private listeners: Record<T, EventHandler<E>[]> = {} as any;

  on(eventName: T | T[], handler: EventHandler<E>, { once = false } = {}) {
    eventName = Array.isArray(eventName) ? eventName : [eventName];
    eventName.forEach(eventName => {
      if (!this.listeners[eventName]) {
        this.listeners[eventName] = [];
      }
      let fn = handler
      if (once) {
        fn = (event) => {
          handler(event);
          this.off(eventName, fn);
        };
      }
      this.listeners[eventName].push(fn);
    })
  }

  off(eventName: T | T[], handler: EventHandler<E>) {
    eventName = Array.isArray(eventName) ? eventName : [eventName];
    eventName.forEach(eventName => {
      if (!this.listeners[eventName]) return
      this.listeners[eventName] = this.listeners[eventName].filter(
        (listener) => listener !== handler
      );
    })
  }

  dispatch(eventName: T, event?: E) {
    if (!this.listeners[eventName]) return
    this.listeners[eventName].forEach((listener) => {
      listener(event);
    });
  }
}
