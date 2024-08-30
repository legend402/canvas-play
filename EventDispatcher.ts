import { EventHandler, MouseType } from "./types";

export class EventDispatcher {
  static EVENT = ['click', 'clickOutside', 'mouseup', 'mousedown', 'mousemove'] as const
  private listeners: Record<MouseType, EventHandler[]> = {} as any;

  on(eventName: MouseType | MouseType[], handler: EventHandler, { once = false } = {}) {
    eventName = Array.isArray(eventName) ? eventName : [eventName];
    eventName.forEach(eventName => {
      if (!this.listeners[eventName]) {
        this.listeners[eventName] = [];
      }
      if (once) {
        handler = (event) => {
          handler(event);
          this.off(eventName, handler);
        };
      }
      this.listeners[eventName].push(handler);
    })
  }

  off(eventName: MouseType | MouseType[], handler: EventHandler) {
    eventName = Array.isArray(eventName) ? eventName : [eventName];
    eventName.forEach(eventName => {
      if (!this.listeners[eventName]) return
      this.listeners[eventName] = this.listeners[eventName].filter(
        (listener) => listener !== handler
      );
    })
  }

  dispatch(eventName: MouseType, event: MouseEvent) {
    if (!this.listeners[eventName]) return
    this.listeners[eventName].forEach((listener) => {
      listener(event);
    });
  }
}
