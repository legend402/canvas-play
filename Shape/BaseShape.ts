import { EventDispatcher } from "../EventDispatcher"
import { MyCanvas } from "../MyCanvas";
import { LineStyle, Point, ShapeType } from "../types";
import { DragMod } from "../utils/DragMod";

export abstract class BaseShape<T extends Record<string, any> = any> extends EventDispatcher {
  protected id: string = Math.random().toString(36).slice(2)
  protected config = {} as T;
  abstract type: ShapeType
  drag: DragMod | undefined;

  canvas: MyCanvas | undefined = undefined
  path2D: Path2D
  protected ctx: CanvasRenderingContext2D | undefined;

  isNeedUpdate: boolean = false
  private zIndex: number = 1
  
  constructor() {
    super()
    this.path2D = new Path2D()
  }
  
  get getConfig() {
    return this.config
  }
  
  get getIndex() {
    return this.zIndex
  }

  setIndex(index: number = 1) {
    if (this.zIndex === index) return;
    this.zIndex = index
    this.update({})
  }

  getCenterPoint(): Point {
    switch (this.type) {
      case ShapeType.Circle:
        return {
          x: this.config.x,
          y: this.config.y
        }
      default:
        return {
          x: this.config.x + this.config.width / 2,
          y: this.config.y + this.config.height / 2
        }
    }
  }

  setLineStyle(lineStyle: LineStyle) {
    this.ctx!.setLineDash(
      lineStyle === 'dashed' 
        ? [5, 5] 
        : lineStyle === 'dotted' 
          ? [1, 5]
          : []
    )
  }

  update(config: Partial<T>) {
    this.config = Object.assign({}, this.config, config)
    if (this.ctx) {
      this.isNeedUpdate = true
      this.render()
    }
  }

  abstract render(ctx?: CanvasRenderingContext2D): void

}