import { BaseShapeOptions, LineStyle, Point, ShapeType } from "../types";
import { DragMod, DragOptions } from "../utils/DragMod";
import { BaseShape } from "./BaseShape";

export type LineConfig = BaseShapeOptions & {
  path: Point[]
  autoClose?: boolean
}

export class Line extends BaseShape<LineConfig> {
  type = ShapeType.Line

  constructor(config: LineConfig) {
    super()
    this.config = Object.assign({
      lineStyle: 'solid',
      opacity: 1,
    }, config)
    this.setIndex(config.zIndex)
    if (config.draggable) {
      this.drag = new DragMod(this, typeof config.draggable === 'boolean' ? {} : config.draggable)
    }
  }

  clone(config: Partial<LineConfig> = {}) {
    return new Line(Object.assign({}, this.config, config))
  }

  render(ctx?: CanvasRenderingContext2D) {
    this.ctx = ctx ?? this.ctx!
    this.path2D = new Path2D()
    const { path } = this.getConfig
    this.ctx.beginPath()
    path.forEach((point, index) => {
      if (index === 0) {
        this.path2D.moveTo(point.x, point.y)
      } else {
        this.path2D.lineTo(point.x, point.y)
      }
    })
    if (this.config.autoClose) {
      this.path2D.closePath()
    }
    this.ctx.strokeStyle = this.config.stroke || '#000000'
    this.ctx.lineWidth = this.config.strokeWidth || 1
    this.setLineStyle(this.config.lineStyle || 'dashed')
    this.ctx.filter = `opacity(${this.config.opacity})`
    this.ctx.stroke(this.path2D)
  }
}