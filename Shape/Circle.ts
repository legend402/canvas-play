import { LineStyle, ShapeType } from "../types";
import { BaseShape } from "./BaseShape";
import { DragMod, DragOptions } from "../utils/DragMod";

export type CircleConfig = {
  x: number;
  y: number;
  radius: number;
  radiusX?: number;
  radiusY?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  lineStyle?: LineStyle;
  draggable?: boolean | DragOptions;
}

export class Circle extends BaseShape<CircleConfig> {
  type = ShapeType.Circle
  constructor(config: CircleConfig) {
    super()
    this.config = Object.assign({
      lineStyle: 'solid',
      radiusX: config.radius,
      radiusY: config.radius,
    }, config)
    
    if (config.draggable) {
      this.drag = new DragMod(this, typeof config.draggable === 'boolean' ? {} : config.draggable)
    }
  }

  clone(config: Partial<CircleConfig> = {}) {
    return new Circle(Object.assign({}, this.config, config))
  }

  setDraggable(draggable: boolean) {
    if (!this.drag) {
      this.drag = new DragMod(this)
    }
    this.drag.setDraggable(draggable)
  }
  
  render(ctx?: CanvasRenderingContext2D) {
    this.ctx = ctx ?? this.ctx!
    const { x, y, radius, radiusX, radiusY } = this.getConfig
    
    this.path2D = new Path2D()
    this.path2D.ellipse(x, y, radiusX || radius, radiusY || radius, 0, 0, Math.PI * 2)
    this.ctx.fillStyle = this.config.fill || '#000000'
    this.ctx.strokeStyle = this.config.stroke || 'transparent'
    this.ctx.lineWidth = this.config.strokeWidth || 0
    this.setLineStyle(this.config.lineStyle || 'dashed')
    this.ctx.fill(this.path2D)
    this.ctx.stroke(this.path2D)
  }
}