import { BaseShapeOptions, ShapeType } from "../types";
import { BaseShape } from "./BaseShape";
import { DragMod, DragOptions } from "../utils/DragMod";

export type RectConfig = BaseShapeOptions & {
  x: number;
  y: number;
  width: number;
  height: number;
  fill?: string;
  radius?: number | number[];
}

export class Rect extends BaseShape<RectConfig> {
  type = ShapeType.Rect

  constructor(config: RectConfig) {
    super()
    this.config = Object.assign({
      lineStyle: 'solid',
      opacity: 1,
      radius: 0,
    }, config)
    this.setIndex(config.zIndex)
    if (config.draggable) {
      this.drag = new DragMod(this, typeof config.draggable === 'boolean' ? {} : config.draggable)
    }
  }

  clone(config: Partial<RectConfig> = {}) {
    return new Rect(Object.assign({}, this.config, config))
  }

  setDraggable(draggable: boolean) {
    if (!this.drag) {
      this.drag = new DragMod(this)
    }
    this.drag.setDraggable(draggable)
  }

  get x() {
    return this.config.x
  }

  get y() {
    return this.config.y
  }

  render(ctx?: CanvasRenderingContext2D) {
    this.ctx = ctx ?? this.ctx!
    this.path2D = new Path2D()
    const x = this.config.x - this.config.width / 2
    const y = this.config.y - this.config.height / 2
    if (this.path2D.roundRect && this.config.radius) {
      this.path2D.roundRect(x, y, this.config.width, this.config.height, this.config.radius)
    } else {
      this.path2D.rect(x, y, this.config.width, this.config.height)
    }
    this.ctx.fillStyle = this.config.fill || '#000000'
    this.ctx.strokeStyle = this.config.stroke || 'transparent'
    this.ctx.lineWidth = this.config.strokeWidth || 0
    this.setLineStyle(this.config.lineStyle || 'dashed')
    this.ctx.filter = `opacity(${this.config.opacity})`
    this.ctx.fill(this.path2D)
    this.ctx.stroke(this.path2D)
  }
}