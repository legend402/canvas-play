export function addEventListener(el: Document | HTMLElement, eventName: keyof HTMLElementEventMap, handler: any) {
  el.addEventListener(eventName, handler)

  return () => {
    el.removeEventListener(eventName, handler)
  }
}