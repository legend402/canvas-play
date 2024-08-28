import { CustomOnDrag, Point, ShapeType } from "../types";
import { addEventListener } from "./utils";
import { BaseShape } from "../Shape/BaseShape";

export type DragOptions = {
  onlyX?: boolean
  onlyY?: boolean
  onDragStart?: (e: MouseEvent) => void
  onDrag?: (e: CustomOnDrag) => void
  onDragEnd?: (e: MouseEvent) => void
}

export class DragMod {
  shape: BaseShape
  draggable = true
  private options: Required<DragOptions> = {} as any
  private isDrag = false
  private removeMouseMove = () => {}
  constructor(shape: BaseShape, options: DragOptions = {}) {
    this.shape = shape
    this.options = {
      onlyX: false,
      onlyY: false,
      onDragStart: () => {},
      onDrag: () => {},
      onDragEnd: () => {},
      ...options
    }
    this.initDraggable()
  }
  initDraggable() {
    this.shape.on('mousedown', (e) => {
      if (!this.draggable) return
      this.isDrag = true
      const { clientX: startX, clientY: startY } = e
      const config = this.shape.getConfig
      this.options.onDragStart(e)
      this.removeMouseMove = addEventListener(document, 'mousemove', (e: MouseEvent) => {
        const { clientX: moveX, clientY: moveY } = e
        this.updateShapePoint(moveX - startX, moveY - startY, config)
      })
    })
    addEventListener(document, 'mouseup', (e: MouseEvent) => {
      if (this.isDrag) {
        this.isDrag = false
        this.removeMouseMove()
        this.options.onDragEnd(e)
      }
    })
  }
  updateShapePoint(offsetX: number, offsetY: number, { path, x, y }: any) {
    const { onlyX, onlyY } = this.options
    switch(this.shape.type) {
      case ShapeType.Polygon:
      case ShapeType.Line: 
        if (onlyX) {
          this.shape.update({
            path: path.map(({ x }: Point) => ({
              x: x + offsetX,
            }))
          })
        } else if (onlyY) {
          this.shape.update({
            path: path.map(({ y }: Point) => ({
              y: y + offsetY,
            }))
          })
        } else {
          this.shape.update({
            path: path.map(({ x, y }: Point) => ({
              x: x + offsetX,
              y: y + offsetY,
            }))
          })
        }
        this.options.onDrag({ offsetX, offsetY })
        return;
      default:
        if (onlyX) {
          this.shape.update({
            x: x + offsetX,
          })
        } else if (onlyY) {
          this.shape.update({
            y: y + offsetY,
          })
        } else {
          this.shape.update({
            x: x + offsetX,
            y: y + offsetY,
          })
        }
        this.options.onDrag({ offsetX, offsetY })
    }
  }
  setDraggable(draggable: boolean) {
    this.draggable = draggable
  }
  get isDragging() {
    return this.isDrag
  }
}