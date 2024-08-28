import { CustomOnDrag, Point, ShapeType } from "../types";
import { BaseShape } from "../Shape/BaseShape";
import { Line } from "../Shape/Line";
import { Circle } from "../Shape/Circle";
import { MyCanvas } from "../MyCanvas";

type ShapeEdge = {
  topLeft: Point,
  topRight: Point,
  bottomRight: Point,
  bottomLeft: Point,
}

export class EditMod {
  shape: BaseShape
  line: Line = new Line({ path: [] })
  dots: Circle[] = []
  constructor(shape: BaseShape) {
    this.shape = shape
    this.init()
  }
  init() {
    const path = this.getShapeEdge(this.shape)
    this.initBorder(path)
    this.initDots(path)
  }

  install(cvs: MyCanvas) {
    cvs.add(this.shape)
    cvs.add(this.line)
    this.dots.forEach(dot => cvs.add(dot))
  }

  initBorder(points: ShapeEdge) {
    let dotsPoints: Point[] = []
    let shapeConfig = {}
    this.line = new Line({
      path: [
        points.topLeft,
        points.topRight,
        points.bottomRight,
        points.bottomLeft,
      ],
      stroke: 'red',
      strokeWidth: 1,
      lineStyle: 'dashed',
      autoClose: true,
      draggable: {
        onDragStart: () => {
          dotsPoints = this.dots.map(item => item.getCenterPoint())
          shapeConfig = { ...this.shape.getConfig }
        },
        onDrag: ({ offsetX, offsetY }) => {
          this.dots.forEach((dot, i) => {
            dot.update({
              x: dotsPoints[i].x + offsetX,
              y: dotsPoints[i].y + offsetY
            })
          })
          this.shape.drag!.updateShapePoint(offsetX, offsetY, shapeConfig)
        },
      },
    })
  }

  initDots(path: ShapeEdge) {
    const dots = this.getDotsPoint(path)
    dots.forEach((dot, i) => {
      let path: Point[] = []
      let shapeConfig = {}
      const circle = new Circle({
        x: dot.x,
        y: dot.y,
        radius: 5,
        fill: '#4e6ef2',
        stroke: 'red',
        strokeWidth: 1,
        draggable: {
          onlyX: i % 2 !== 0,
          onlyY: i % 2 === 0,
          onDragStart: () => {
            path = this.line!.getConfig.path
            shapeConfig = { ...this.shape.getConfig }
          },
          onDrag: (e) => {
            this.updateBorderDots(e, path, i)
            this.updateDots(i)
            this.updateShape(e, shapeConfig, i)
          }
        }
      })
      this.dots.push(circle)
    })
  }
  updateBorderDots(e: CustomOnDrag, path: Point[], i: number) {
    if (i === 0) {
      this.line!.update({
        path: [
          { x: path[0].x, y: path[0].y + e.offsetY },
          { x: path[1].x, y: path[1].y + e.offsetY },
          path[2],
          path[3],
        ]
      })
    }
    if (i === 1) {
      this.line!.update({
        path: [
          path[0],
          { x: path[1].x + e.offsetX, y: path[1].y },
          { x: path[2].x + e.offsetX, y: path[2].y },
          path[3],
        ]
      })
    }
    if (i === 2) {
      this.line!.update({
        path: [
          path[0],
          path[1],
          { x: path[2].x, y: path[2].y + e.offsetY },
          { x: path[3].x, y: path[3].y + e.offsetY },
        ]
      })
    }
    if (i === 3) {
      this.line!.update({
        path: [
          { x: path[0].x + e.offsetX, y: path[0].y },
          path[1],
          path[2],
          { x: path[3].x + e.offsetX, y: path[3].y },
        ]
      })
    }
  }
  updateDots(i: number) {
    const { topLeft, topRight, bottomLeft } = this.getShapeEdge(this.line!)
    const dotY = this.dots[0].getConfig.y + (bottomLeft.y - topLeft.y) / 2
    const dotX = this.dots[3].getConfig.x + (topRight.x - topLeft.x) / 2
    if (i === 0) {
      this.dots[1].update({
        y: dotY,
      })
      
      this.dots[3].update({
        y: dotY,
      })
    }
    if (i === 1) {
      this.dots[0].update({
        x: dotX,
      })
      
      this.dots[2].update({
        x: dotX,
      })
    }
    if (i === 2) {
      this.dots[1].update({
        y: dotY,
      })
      
      this.dots[3].update({
        y: dotY,
      })
    }
    if (i === 3) {
      
      this.dots[0].update({
        x: dotX,
      })
      
      this.dots[2].update({
        x: dotX,
      })
    }
  }
  updateShape(e: CustomOnDrag, shapeConfig: any, i: number) {
    switch (this.shape.type) {
      case ShapeType.Circle:
        if (i === 0) {
          this.shape.update({
            y: shapeConfig.y + e.offsetY / 2,
            radiusY: shapeConfig.radiusY - (e.offsetY / 2)
          })
        } else if (i === 1) {
          this.shape.update({
            x: shapeConfig.x + e.offsetX / 2,
            radiusX: shapeConfig.radiusX + (e.offsetX / 2)
          })
        } else if (i === 2) {
          this.shape.update({
            y: shapeConfig.y + e.offsetY / 2,
            radiusY: shapeConfig.radiusY + (e.offsetY / 2)
          })
        } else if (i === 3) {
          this.shape.update({
            x: shapeConfig.x + e.offsetX / 2,
            radiusX: shapeConfig.radiusX - (e.offsetX / 2)
          })
        }
        return
      case ShapeType.Rect:
        if (i === 0) {
          this.shape.update({
            y: shapeConfig.y + e.offsetY,
            height: shapeConfig.height - e.offsetY
          })
        } else if (i === 1) {
          this.shape.update({
            width: shapeConfig.width + e.offsetX
          })
        } else if (i === 2) {
          this.shape.update({
            height: shapeConfig.height + e.offsetY
          })
        } else if (i === 3) {
          this.shape.update({
            x: shapeConfig.x + e.offsetX,
            width: shapeConfig.width - e.offsetX
          })
        }
    }
  }
  getShapeEdge(shape: BaseShape): ShapeEdge {
    const config = shape.getConfig
    switch (shape.type) {
      case ShapeType.Circle:
        return {
          topLeft: {
            x: config.x - config.radius,
            y: config.y - config.radius
          },
          topRight: {
            x: config.x + config.radius,
            y: config.y - config.radius
          },
          bottomRight: {
            x: config.x + config.radius,
            y: config.y + config.radius
          },
          bottomLeft: {
            x: config.x - config.radius,
            y: config.y + config.radius
          },
        }
      case ShapeType.Rect:
        return {
          topLeft: {
            x: config.x,
            y: config.y
          },
          topRight: {
            x: config.x + config.width,
            y: config.y
          },
          bottomRight: {
            x: config.x + config.width,
            y: config.y + config.height
          },
          bottomLeft: {
            x: config.x,
            y: config.y + config.height
          },
        }
      case ShapeType.Line:
      case ShapeType.Polygon:
        const { minX, maxX, maxY, minY } = this.getPathShapeEdge(config.path)
        return {
          topLeft: {
            x: minX,
            y: minY
          },
          topRight: {
            x: maxX,
            y: minY
          },
          bottomRight: {
            x: maxX,
            y: maxY
          },
          bottomLeft: {
            x: minX,
            y: maxY
          },
        }
      default:
        return {
          topLeft: {
            x: 0,
            y: 0
          },
          topRight: {
            x: 0,
            y: 0
          },
          bottomRight: {
            x: 0,
            y: 0
          },
          bottomLeft: {
            x: 0,
            y: 0
          },
        }
    }
  }
  getPathShapeEdge(path: Point[]) {
    const x = path.map(item => item.x)
    const y = path.map(item => item.y)
    return {
      maxX: Math.max(...x),
      minX: Math.min(...x),
      maxY: Math.max(...y),
      minY: Math.min(...y),
    }
  }

  getDotsPoint(path: ShapeEdge): Point[] {
    return [
      // top
      {
        x: (path.topLeft.x + path.topRight.x) / 2,
        y: path.topLeft.y
      },
      // right
      {
        x: path.topRight.x,
        y: (path.topRight.y + path.bottomRight.y) / 2
      },
      // bottom
      {
        x: (path.bottomLeft.x + path.bottomRight.x) / 2,
        y: path.bottomLeft.y
      },
      // left
      {
        x: path.topLeft.x,
        y: (path.topLeft.y + path.bottomLeft.y) / 2
      }
    ]
  }
}