import { BaseShapeOptions, Point, ShapeType } from "../types";
import { BaseShape } from "./BaseShape";
import { DragMod } from "../utils/DragMod";

export type RectConfig = BaseShapeOptions & {
  path: Point[]
  fill?: string;
}

export class Polygon extends BaseShape<RectConfig> {
  type = ShapeType.Polygon

  constructor(config: RectConfig) {
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

  clone(config: Partial<RectConfig> = {}) {
    return new Polygon(Object.assign({}, this.config, config))
  }

  render(ctx?: CanvasRenderingContext2D) {
    this.ctx = ctx ?? this.ctx!
    this.path2D = new Path2D()
    const { path } = this.getConfig
    path.forEach((point, index) => {
      if (index === 0) {
        this.path2D.moveTo(point.x, point.y)
      } else {
        this.path2D.lineTo(point.x, point.y)
      }
    })
    this.path2D.closePath()
    this.ctx.fillStyle = this.config.fill || '#000000'
    this.ctx.strokeStyle = this.config.stroke || 'transparent'
    this.ctx.lineWidth = this.config.strokeWidth || 0
    this.setLineStyle(this.config.lineStyle || 'dashed')
    this.ctx.filter = `opacity(${this.config.opacity})`
    this.ctx.fill(this.path2D)
    this.ctx.stroke(this.path2D)
  }
}