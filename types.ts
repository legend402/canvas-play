import { DragOptions } from "./mod/DragMod";

export enum ShapeType {
  Circle = 'circle',
  Rect = 'rect',
  Polygon = 'polygon',
  Line = 'line',
  Text = 'text',
  Picture = 'picture',
  EditMod = 'EditMod'
}

export type EventHandler<T extends any = MouseEvent> = (event: T) => void

export type Point = {
  x: number;
  y: number;
}

export type LineStyle = 'solid' | 'dashed' | 'dotted'

export type CustomOnDrag = { offsetX: number, offsetY: number }

export type ShapeWH = {
  width: number;
  height: number;
}

export type BaseShapeOptions = {
  stroke?: string;
  strokeWidth?: number;
  lineStyle?: LineStyle;
  draggable?: boolean | DragOptions;
  opacity?: number;
  zIndex?:number;
}

export type EditOptions = {
  borderColor: string;
  borderWidth: number;
  borderStyle: LineStyle;
  dotStyle: {
    fill: string;
    size: number;
    stroke: string;
    strokeWidth: number;
  }
}