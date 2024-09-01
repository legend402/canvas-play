import { BaseShapeOptions, LineStyle, ShapeType } from "../types";
import { BaseShape } from "./BaseShape";
import { DragMod, DragOptions } from "../mod/DragMod";

export type CircleConfig = BaseShapeOptions & {
  x: number;
  y: number;
  radius: number;
  radiusX?: number;
  radiusY?: number;
  fill?: string;
}

export class Circle extends BaseShape<CircleConfig> {
  type = ShapeType.Circle
  constructor(config: CircleConfig) {
    super()
    this.config = Object.assign({
      lineStyle: 'solid',
      radiusX: config.radius,
      radiusY: config.radius,
      opacity: 1,
    }, config)
    this.setIndex(config.zIndex)
    
    if (config.draggable) {
      this.drag = new DragMod(this, typeof config.draggable === 'boolean' ? {} : config.draggable)
    }
  }

  clone(config: Partial<CircleConfig> = {}) {
    return new Circle(Object.assign({}, this.config, config))
  }

  get x() {
    return this.config.x
  }

  get y() {
    return this.config.y
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
    this.ctx.filter = `opacity(${this.config.opacity})`
    this.ctx.fill(this.path2D)
    this.ctx.stroke(this.path2D)
  }
}