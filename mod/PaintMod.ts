import { EventDispatcher } from "../EventDispatcher";
import MyCanvas from "../MyCanvas";
import { BaseShape } from "../Shape/BaseShape";
import { Circle } from "../Shape/Circle";
import { Line } from "../Shape/Line";
import { Polygon } from "../Shape/Polygon";
import { Rect } from "../Shape/Rect";
import { getHypotenuseLength, getMousePosInDom } from "../utils/utils";

export type PaintEvent = 'drawStart' | 'drawEnd'

export default class PaintMod extends EventDispatcher<PaintEvent, BaseShape> {
  private isPainting = false
  private canvas: MyCanvas
  constructor(ctx: MyCanvas) {
    super()
    this.canvas = ctx
  }

  drawLine() {
    if (this.isPainting) throw new Error('正在绘制图形中')
    this.isPainting = true
    const line = new Line({ path: [], stroke: '#1890ff', strokeWidth: 2 })
    let len = 0
    this.dispatch('drawStart')
    function onClick(e: MouseEvent) {
      const { x, y } = getMousePosInDom(e)
      const path = line.getPath
      if (path.length > 1) {
        path.at(-1)!.x = x
        path.at(-1)!.y = y
        line.update({
          path: path
        })
      } else {
        line.update({
          path: path.concat({ x, y })
        })
      }
      len++
    }
    function onMousemove(e: MouseEvent) {
      if (len === 0) return
      const { x, y } = getMousePosInDom(e)
      const path = line.getPath
      if (len === line.getPath.length) {
        line.update({
          path: path.concat({ x, y })
        })
      } else {
        if (path.length > 1) {
          path.at(-1)!.x = x
          path.at(-1)!.y = y
          line.update({
            path: path
          })
        }
      }
    }
    this.canvas.on('click', onClick)
    this.canvas.on('mousemove', onMousemove)
    this.canvas.on('dblclick', (e) => {
      const { x, y } = getMousePosInDom(e)
      line.update({
        path: line.getPath.concat({ x, y })
      })
      this.canvas.off('click', onClick)
      this.canvas.off('mousemove', onMousemove)
      this.dispatch('drawEnd', line)
      this.isPainting = false
    }, { once: true })
    this.canvas.add(line)
  }

  drawCircle({ ellipse = false } = {}) {
    if (this.isPainting) throw new Error('正在绘制图形中')
    this.isPainting = true
    const circle = new Circle({ radius: 0, x: 0, y: 0, stroke: '#1890ff', strokeWidth: 2, fill: '#1890ff10' })
    this.dispatch('drawStart')
    const onMousedown = (e: MouseEvent) => {
      const { x, y } = getMousePosInDom(e)
      circle.update({
        x,
        y
      })
      this.canvas.on('mousemove', onMousemove)
    }
    const onMousemove = (e: MouseEvent) => {
      const { x, y } = getMousePosInDom(e)
      if (ellipse) {
        circle.update({
          radiusX: Math.abs(circle.x - x),
          radiusY: Math.abs(circle.y - y),
        })
      } else {
        const radius = getHypotenuseLength({ width: circle.x - x, height: circle.y - y })
        circle.update({
          radiusX: radius,
          radiusY: radius,
        })
      }
    }
    this.canvas.on('mousedown', onMousedown)
    this.canvas.on('mouseup', () => {
      this.canvas.off('mousedown', onMousedown)
      this.canvas.off('mousemove', onMousemove)
      this.isPainting = false
      this.dispatch('drawEnd', circle)
    }, { once: true })
    this.canvas.add(circle)
  }

  drawRect({ square = false } = {}) {
    if (this.isPainting) throw new Error('正在绘制图形中')
    this.isPainting = true
    const rect = new Rect({ x: 0, y: 0, width: 0, height: 0, stroke: '#1890ff', strokeWidth: 2, fill: '#1890ff10' })
    const onMousedown = (e: MouseEvent) => {
      const { x, y } = getMousePosInDom(e)
      rect.update({
        x,
        y
      })
      this.canvas.on('mousemove', onMousemove)
    }
    const onMousemove = (e: MouseEvent) => {
      const { x, y } = getMousePosInDom(e)
      if (square) {
        const len = getHypotenuseLength({ width: rect.x - x, height: rect.y - y }) * 2
        rect.update({
          width: len,
          height: len,
        })
      } else {
        rect.update({
          width: Math.abs(rect.x - x) * 2,
          height: Math.abs(rect.y - y) * 2,
        })
      }
    }
    this.canvas.on('mousedown', onMousedown)
    this.canvas.on('mouseup', () => {
      this.canvas.off('mousedown', onMousedown)
      this.canvas.off('mousemove', onMousemove)
      this.isPainting = false
      this.dispatch('drawEnd', rect)
    }, { once: true })
    this.canvas.add(rect)
  }

  drawPolygon() {
    if (this.isPainting) throw new Error('正在绘制图形中')
      this.isPainting = true
      const polygon = new Polygon({ path: [], stroke: '#1890ff', strokeWidth: 2, fill: '#1890ff10' })
      let len = 0
      function onClick(e: MouseEvent) {
        const { x, y } = getMousePosInDom(e)
        const path = polygon.getPath
        if (path.length > 1) {
          path.at(-1)!.x = x
          path.at(-1)!.y = y
          polygon.update({
            path: path
          })
        } else {
          polygon.update({
            path: path.concat({ x, y })
          })
        }
        len++
      }
      function onMousemove(e: MouseEvent) {
        if (len === 0) return
        const { x, y } = getMousePosInDom(e)
        const path = polygon.getPath
        if (len === polygon.getPath.length) {
          polygon.update({
            path: path.concat({ x, y })
          })
        } else {
          if (path.length > 1) {
            path.at(-1)!.x = x
            path.at(-1)!.y = y
            polygon.update({
              path: path
            })
          }
        }
      }
      this.canvas.on('click', onClick)
      this.canvas.on('mousemove', onMousemove)
      this.canvas.on('dblclick', (e) => {
        const { x, y } = getMousePosInDom(e)
        polygon.update({
          path: polygon.getPath.concat({ x, y })
        })
        this.canvas.off('click', onClick)
        this.canvas.off('mousemove', onMousemove)
        this.isPainting = false
        this.dispatch('drawEnd', polygon)
      }, { once: true })
      this.canvas.add(polygon)
  }
}