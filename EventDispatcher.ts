import { EventHandler, MouseType } from "./types";

export class EventDispatcher {
  static EVENT = ['click', 'mouseup', 'mousedown', 'mousemove'] as const
  private listeners: Record<MouseType, EventHandler[]> = {} as any;

  on(eventName: MouseType, handler: EventHandler, { once = false } = {}) {
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
  }

  off(eventName: MouseType, handler: EventHandler) {
    if (!this.listeners[eventName]) return
    this.listeners[eventName] = this.listeners[eventName].filter(
      (listener) => listener !== handler
    );
  }

  dispatch(eventName: MouseType, event: MouseEvent) {
    if (!this.listeners[eventName]) return
    this.listeners[eventName].forEach((listener) => {
      listener(event);
    });
  }
}
