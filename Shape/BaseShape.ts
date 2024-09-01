import { EventDispatcher } from "../EventDispatcher"
import MyCanvas from "../MyCanvas";
import { BaseShapeOptions, LineStyle, Point, ShapeType } from "../types";
import { DragMod } from "../mod/DragMod";
import { uuid } from "../utils/utils";

export abstract class BaseShape<T extends BaseShapeOptions & { [key: string]: any } = any> extends EventDispatcher {
  protected id: string = uuid()
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

  getCenterPoint(config?: any): Point {
    config = config || this.config
    switch (this.type) {
      case ShapeType.Circle:
      case ShapeType.Rect:
      case ShapeType.Picture:
        return {
          x: config.x,
          y: config.y
        }
      case ShapeType.Line:
      case ShapeType.Polygon:
        const { minX, minY, maxX, maxY } = this.getPathShapeEdge(config.path)
        return {
          x: (maxX + minX) / 2,
          y: (maxY + minY) / 2
        }
      default:
        return {
          x: 0,
          y: 0
        }
    }
  }
  private getPathShapeEdge(path: Point[]) {
    const x = path.map(item => item.x)
    const y = path.map(item => item.y)
    return {
      maxX: Math.max(...x),
      minX: Math.min(...x),
      maxY: Math.max(...y),
      minY: Math.min(...y),
    }
  }

  setDraggable(draggable: boolean) {
    if (!this.drag) {
      this.drag = new DragMod(this)
    }
    this.drag.setDraggable(draggable)
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
    if (config.zIndex) {
      this.setIndex(config.zIndex)
    }
    if (this.ctx) {
      this.isNeedUpdate = true
      this.render()
    }
  }

  abstract render(ctx?: CanvasRenderingContext2D): void

}