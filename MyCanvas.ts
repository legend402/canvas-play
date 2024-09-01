import { EventDispatcher } from "./EventDispatcher"
import { BaseShape } from "./Shape/BaseShape"
import { EditOptions } from "./types"
import { EditMod } from "./mod/EditMod"
import { addEventListener } from "./utils/utils"

export default class MyCanvas extends EventDispatcher {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D

  private shapeList: BaseShape[] = []
  
  private editList: EditMod[] = []
  private editOptions: Partial<EditOptions>

  constructor(el: HTMLElement = document.body) {
    super()
    this.canvas = document.createElement('canvas')
    this.setContainerSize(el.offsetWidth, el.offsetHeight)
    this.ctx = this.canvas.getContext('2d')!
    el.appendChild(this.canvas)

    this.update()
    this.initEvent()
    this.initResize(el)
  }

  setContainerSize(width: number, height: number) {
    this.canvas.width = width
    this.canvas.height = height
  }

  add(shape: BaseShape | EditMod) {
    if (shape instanceof EditMod) {
      shape.install(this)
      this.editList.push(shape)
      this.editOptions && shape.update(this.editOptions)
    } else {
      this.shapeList.push(shape)
      shape.canvas = this
    }
    this.render()
  }
  remove(shape: BaseShape | EditMod) {
    if (shape instanceof EditMod) {
      shape.uninstall(this)
      this.editList = this.editList.filter(spe => spe === shape)
    } else {
      this.shapeList = this.shapeList.filter(spe => spe === shape)
    }
    this.render()
  }

  setEditOptions(options: Partial<EditOptions>) {
    this.editOptions = options
    this.editList.forEach(shape => {
      shape.update(options)
    })
  }

  private update() {
    let isNeedUpdate = false
    this.shapeList.forEach((shape) => {
      if (shape.isNeedUpdate) {
        shape.isNeedUpdate = false
        isNeedUpdate = true
      }
    })
    
    if (isNeedUpdate) {
      this.shapeList.sort((a, b) => a.getIndex - b.getIndex)
      this.render()
    }
    requestAnimationFrame(this.update.bind(this))
  }

  private render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.shapeList.forEach(shape => shape.render(this.ctx))
  }

  private initEvent() {
    EventDispatcher.EVENT.filter(evt => evt !== 'clickOutside').forEach(event => {
      this.canvas.addEventListener(event, (e) => {
        this.dispatch(event, e)
        // 获取当前点击的图形, 并且阻止事件向下传递
        let lastShape: BaseShape | undefined
        this.shapeList.forEach(shape => {
          if (this.ctx.isPointInPath(shape.path2D, e.offsetX, e.offsetY)) {
            if (!lastShape || lastShape.getIndex <= shape.getIndex) {
              lastShape = shape
            }
          } else {
            event === 'mousedown' && shape.dispatch('clickOutside', e)
          }
        })
        
        lastShape && lastShape.dispatch(event, e)
      })
    })
  }

  private initResize(el: HTMLElement) {
    addEventListener(window, 'resize', () => {
      this.setContainerSize(el.offsetWidth, el.offsetHeight)
      this.render()
    })
  }
}