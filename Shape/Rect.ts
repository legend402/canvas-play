import { LineStyle, ShapeType } from "../types";
import { BaseShape } from "./BaseShape";
import { DragMod, DragOptions } from "../utils/DragMod";

export type RectConfig = {
  x: number;
  y: number;
  width: number;
  height: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  lineStyle?: LineStyle;
  draggable?: boolean | DragOptions;
}

export class Rect extends BaseShape<RectConfig> {
  type = ShapeType.Rect

  constructor(config: RectConfig) {
    super()
    this.config = Object.assign({
      lineStyle: 'solid'
    }, config)
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

  render(ctx?: CanvasRenderingContext2D) {
    this.ctx = ctx ?? this.ctx!
    this.path2D = new Path2D()
    this.path2D.rect(this.config.x, this.config.y, this.config.width, this.config.height)
    this.ctx.fillStyle = this.config.fill || '#000000'
    this.ctx.strokeStyle = this.config.stroke || 'transparent'
    this.ctx.lineWidth = this.config.strokeWidth || 0
    this.setLineStyle(this.config.lineStyle || 'dashed')
    this.ctx.fill(this.path2D)
    this.ctx.stroke(this.path2D)
  }
}