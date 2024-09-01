import { Point, ShapeWH } from "../types";

export function addEventListener(el: Document | HTMLElement | Window, eventName: keyof HTMLElementEventMap, handler: any) {
  el.addEventListener(eventName, handler)

  return () => {
    el.removeEventListener(eventName, handler)
  }
}

export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      resolve(img)
    }
    img.onerror = () => {
      reject(null)
    }
  })
}

/** 获取鼠标位于元素中的位置 */
export function getMousePosInDom(e: MouseEvent): Point {
  const { offsetLeft, offsetTop } = e.target as HTMLElement
  return {
    x: e.pageX - offsetLeft,
    y: e.pageY - offsetTop
  }
}

/**
 * 根据宽高获取斜边的长度
 */
export function getHypotenuseLength({ width, height }: ShapeWH) {
  return Math.sqrt(Math.pow(Math.abs(width), 2) + Math.pow(height, 2))
}