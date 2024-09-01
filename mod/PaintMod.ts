import MyCanvas from "../MyCanvas";
import { Circle } from "../Shape/Circle";
import { Line } from "../Shape/Line";
import { Rect } from "../Shape/Rect";
import { getHypotenuseLength, getMousePosInDom } from "../utils/utils";


export default class PaintMod {
  private isPainting = false
  private canvas: MyCanvas
  constructor(ctx: MyCanvas) {
    this.canvas = ctx
  }

  drawLine() {
    if (this.isPainting) return new Error('正在绘制图形中')
    this.isPainting = true
    const line = new Line({ path: [] })
    let len = 0
    function onClick(e: MouseEvent) {
      const { x, y } = getMousePosInDom(e)
      const path = line.getPath
      if (path.length > 1) {
        path.at(-1).x = x
        path.at(-1).y = y
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
          path.at(-1).x = x
          path.at(-1).y = y
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
      this.isPainting = false
    }, { once: true })
    this.canvas.add(line)
  }

  drawCircle({ ellipse = false } = {}) {
    if (this.isPainting) return new Error('正在绘制图形中')
    this.isPainting = true
    const circle = new Circle({ radius: 0, x: 0, y: 0 })
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
        circle.update({
          radius: getHypotenuseLength({ width: circle.x - x, height: circle.y - y }),
        })
      }
    }
    this.canvas.on('mousedown', onMousedown)
    this.canvas.on('mouseup', () => {
      this.canvas.off('mousedown', onMousedown)
      this.canvas.off('mousemove', onMousemove)
      this.isPainting = false
    }, { once: true })
    this.canvas.add(circle)
  }

  drawRect({ square = false } = {}) {
    if (this.isPainting) return new Error('正在绘制图形中')
    this.isPainting = true
    const rect = new Rect({ x: 0, y: 0, width: 0, height: 0 })
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
    }, { once: true })
    this.canvas.add(rect)
  }
}