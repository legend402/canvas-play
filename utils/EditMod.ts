import { CustomOnDrag, Point, ShapeType, ShapeWH } from "../types";
import { BaseShape } from "../Shape/BaseShape";
import { Rect } from "../Shape/Rect";
import { Circle } from "../Shape/Circle";
import { MyCanvas } from "../MyCanvas";
import { uuid } from "./utils";

type ShapeEdge = {
  topLeft: Point,
  topRight: Point,
  bottomRight: Point,
  bottomLeft: Point,
}

export class EditMod {
  id = uuid()
  shape: BaseShape
  line: Rect = new Rect({ x: 0, y: 0, height: 0, width: 0 })
  dots: Circle[] = []

  canvas: MyCanvas | undefined
  isActive = false
  constructor(shape: BaseShape) {
    this.shape = shape
    shape.setDraggable(true)
    this.init()
  }
  init() {
    const path = this.getShapeEdge(this.shape.getConfig, this.shape.type)
    this.initBorder(path)
    this.initDots(path)
    this.initEvent()
  }

  install(cvs: MyCanvas) {
    this.canvas = cvs
    cvs.add(this.shape)
    cvs.add(this.line)
    this.dots.forEach(dot => cvs.add(dot))
  }

  uninstall(cvs: MyCanvas) {
    cvs.remove(this.shape)
    cvs.remove(this.line)
    this.dots.forEach(dot => cvs.remove(dot))
  }
  
  private initBorder(points: ShapeEdge) {
    let dotsPoints: Point[] = []
    let shapeConfig = {}
    const width = Math.abs(points.topRight.x - points.topLeft.x)
    const height = Math.abs(points.bottomLeft.y - points.topLeft.y)
    this.line = new Rect({
      x: points.topLeft.x + width / 2,
      y: points.topLeft.y + height / 2,
      width,
      height,
      stroke: 'red',
      strokeWidth: 1,
      lineStyle: 'dashed',
      fill: 'transparent',
      opacity: 0,
      draggable: {
        onDragStart: () => {
          dotsPoints = this.dots.map(item => item.getCenterPoint())
          shapeConfig = this.shape.getConfig
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

  private initDots(path: ShapeEdge) {
    const dots = this.getDotsPoint(path)
    let shapeConfig = this.shape.getConfig
    this.dots = dots.map((dot, i) => 
      new Circle({
        x: dot.x,
        y: dot.y,
        radius: 5,
        fill: '#4e6ef2',
        stroke: 'red',
        strokeWidth: 1,
        opacity: 0,
        draggable: {
          onlyX: i % 2 !== 0,
          onlyY: i % 2 === 0,
          onDragStart: () => {
            shapeConfig = this.shape.getConfig
          },
          onDrag: (e) => {
            this.updateShape(e, shapeConfig, i)
            this.updateBorder(e, shapeConfig, i)
            this.updateDots(e, shapeConfig, i)
          },
          onDragEnd: () => {
            // 变形结束后，恢复dot位置
            const y1 = this.dots[0].y, y2 = this.dots[2].y
            const x1 = this.dots[3].x, x2 = this.dots[1].x
            if (y1 > y2) {
              this.dots[0].update({ y: y2 })
              this.dots[2].update({ y: y1 })
            }
            if (x1 > x2) {
              this.dots[3].update({ x: x2 })
              this.dots[1].update({ x: x1 })
            }
          }
        }
      })
    )
  }
  private updateBorder(e: CustomOnDrag, shapeConfig: any, i: number) {
    const { width, height } = this.getShapeWH(shapeConfig, this.shape.type)
    const { x, y } = this.shape.getCenterPoint(shapeConfig)
    
    if (i === 0) {
      this.line.update({
        y: y + e.offsetY / 2,
        height: Math.abs(height - e.offsetY)
      })
    } else if (i === 1) {
      this.line.update({
        x: x + e.offsetX / 2,
        width: Math.abs(width + e.offsetX)
      })
    } else if (i === 2) {
      this.line.update({
        y: y + e.offsetY / 2,
        height: Math.abs(height + e.offsetY)
      })
    } else if (i === 3) {
      this.line.update({
        x: x + e.offsetX / 2,
        width: Math.abs(width - e.offsetX)
      })
    }
  }
  private updateDots({ offsetX, offsetY }: CustomOnDrag, shapeConfig: any, i: number) {
    const { topLeft, topRight, bottomLeft } = this.getShapeEdge(this.line.getConfig, this.line.type)
    const { width, height } = this.getShapeWH(shapeConfig, this.shape.type)

    let dotY = this.dots[0].getConfig.y + (bottomLeft.y - topLeft.y) / 2
    if (offsetY < 0 && height < Math.abs(offsetY) && i === 3 || !(dotY >= topLeft.y && dotY <= bottomLeft.y)) {
      dotY = this.dots[0].getConfig.y - (bottomLeft.y - topLeft.y) / 2
    }
    let dotX = this.dots[3].getConfig.x + (topRight.x - topLeft.x) / 2
    if (offsetX < 0 && width < Math.abs(offsetX) && i === 1 || !(dotX >= topLeft.x && dotX <= topRight.x)) {
      dotX = this.dots[3].getConfig.x - (topRight.x - topLeft.x) / 2
    }
    
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
  private updateShape(e: CustomOnDrag, shapeConfig: any, i: number) {
    switch (this.shape.type) {
      case ShapeType.Circle:
        if (i === 0) {
          this.shape.update({
            y: shapeConfig.y + e.offsetY / 2,
            radiusY: Math.abs(shapeConfig.radiusY - (e.offsetY / 2))
          })
        } else if (i === 1) {
          this.shape.update({
            x: shapeConfig.x + e.offsetX / 2,
            radiusX: Math.abs(shapeConfig.radiusX + (e.offsetX / 2))
          })
        } else if (i === 2) {
          this.shape.update({
            y: shapeConfig.y + e.offsetY / 2,
            radiusY: Math.abs(shapeConfig.radiusY + (e.offsetY / 2))
          })
        } else if (i === 3) {
          this.shape.update({
            x: shapeConfig.x + e.offsetX / 2,
            radiusX: Math.abs(shapeConfig.radiusX - (e.offsetX / 2))
          })
        }
        return
      case ShapeType.Rect:
        if (i === 0) {
          this.shape.update({
            y: shapeConfig.y + e.offsetY / 2,
            height: Math.abs(shapeConfig.height - e.offsetY)
          })
        } else if (i === 1) {
          this.shape.update({
            x: shapeConfig.x + e.offsetX / 2,
            width: Math.abs(shapeConfig.width + e.offsetX)
          })
        } else if (i === 2) {
          this.shape.update({
            y: shapeConfig.y + e.offsetY / 2,
            height: Math.abs(shapeConfig.height + e.offsetY)
          })
        } else if (i === 3) {
          this.shape.update({
            x: shapeConfig.x + e.offsetX / 2,
            width: Math.abs(shapeConfig.width - e.offsetX)
          })
        }
        return
      case ShapeType.Line:
      case ShapeType.Polygon:
        const { minX, minY } = this.getPathShapeEdge(shapeConfig.path)
        const { width, height } = this.getShapeWH(shapeConfig, this.shape.type)
        if (i === 0) {
          console.log(height - e.offsetY);
          
          this.shape.update({
            path: shapeConfig.path.map(({ x, y }: Point) => {
              return {
                x,
                y: (y - minY) / height * (height - e.offsetY) + minY - e.offsetY
              }
            })
          })
        } else if (i === 1) {
          this.shape.update({
            path: shapeConfig.path.map(({ x, y }: Point) => {
              return {
                x: (x - minX) / width * (width + e.offsetX) + minX,
                y
              }
            })
          })
        } else if (i === 2) {
          this.shape.update({
            path: shapeConfig.path.map(({ x, y }: Point) => {
              return {
                x,
                y: (y - minY) / height * (height + e.offsetY) + minY
              }
            })
          })
        } else if (i === 3) {
          this.shape.update({
            path: shapeConfig.path.map(({ x, y }: Point) => {
              return {
                x: (x - minX) / width * (width - e.offsetX) + minX - e.offsetX,
                y
              }
            })
          })
        }
        return
    }
  }
  getShapeEdge(config: any, type: ShapeType): ShapeEdge {
    switch (type) {
      case ShapeType.Circle:
        return {
          topLeft: {
            x: config.x - config.radiusX,
            y: config.y - config.radiusY
          },
          topRight: {
            x: config.x + config.radiusX,
            y: config.y - config.radiusY
          },
          bottomRight: {
            x: config.x + config.radiusX,
            y: config.y + config.radiusY
          },
          bottomLeft: {
            x: config.x - config.radiusX,
            y: config.y + config.radiusY
          },
        }
      case ShapeType.Rect:
        return {
          topLeft: {
            x: config.x - config.width / 2,
            y: config.y - config.height / 2
          },
          topRight: {
            x: config.x + config.width / 2,
            y: config.y - config.height / 2
          },
          bottomRight: {
            x: config.x + config.width / 2,
            y: config.y + config.height / 2
          },
          bottomLeft: {
            x: config.x - config.width / 2,
            y: config.y + config.height / 2
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

  private getDotsPoint(path: ShapeEdge): Point[] {
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

  private getShapeWH(config: any, type: ShapeType): ShapeWH {
    switch(type) {
      case ShapeType.Circle:
        return {
          width: config.radiusX * 2,
          height: config.radiusY * 2,
        }
      case ShapeType.Rect:
        return {
          width: config.width,
          height: config.height,
        }
      case ShapeType.Polygon:
      case ShapeType.Line:
        const edge = this.getPathShapeEdge(config.path)
        return {
          width: edge.maxX - edge.minX,
          height: edge.maxY - edge.minY,
        }
    }
    return {
      width: 0,
      height: 0
    }
  }

  private initEvent() {
    [this.line, ... this.dots].forEach(shape => {
      shape.on('clickOutside', () => {
        if (!this.isActive) return
        this.isActive = false
        this.shape.update({
          zIndex: this.shape.getIndex - 9999,
        })
        this.line.update({
          opacity: 0,
          zIndex: this.line.getIndex - 9999,
        })
        this.dots.forEach(dot => dot.update({
          opacity: 0,
          zIndex: dot.getIndex - 9999,
        }))
      })
      shape.on(['click', 'mousedown'], () => {
        if (this.isActive) return
        this.isActive = true
        this.shape.update({
          zIndex: this.shape.getIndex + 9999,
        })
        this.line.update({
          opacity: 1,
          zIndex: this.line.getIndex + 9999,
        })
        this.dots.forEach(dot => dot.update({
          opacity: 1,
          zIndex: dot.getIndex + 9999,
        }))
      })
    })
  }
}