export enum ShapeType {
  Circle = 'circle',
  Rect = 'rect',
  Polygon = 'polygon',
  Line = 'line',
  Text = 'text',
  Image = 'image',
}

export type MouseType = 'mouseup' | 'mousedown' | 'mousemove' | 'click'

export type EventHandler = (event: MouseEvent) => void

export type Point = {
  x: number;
  y: number;
}

export type LineStyle = 'solid' | 'dashed' | 'dotted'

export type CustomOnDrag = { offsetX: number, offsetY: number }