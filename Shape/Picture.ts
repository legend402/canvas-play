import { BaseShapeOptions, ShapeType, ShapeWH } from "../types";
import { BaseShape } from "./BaseShape";
import { DragMod } from "../mod/DragMod";
import { loadImage } from "../utils/utils";

export type PictureConfig = BaseShapeOptions & {
  src: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number | number[];
}

export class Picture extends BaseShape<PictureConfig> {
  type = ShapeType.Picture
  isImageLoaded = true
  imgLoadedFn = () => {}
  private cacheImg: HTMLImageElement[] = []

  constructor(config: PictureConfig) {
    super()
    this.config = Object.assign({
      lineStyle: 'solid',
      opacity: 1,
      radius: 0,
      width: 0,
      height: 0
    }, config)
    this.setIndex(config.zIndex)
    if (config.draggable) {
      this.drag = new DragMod(this, typeof config.draggable === 'boolean' ? {} : config.draggable)
    }
  }

  clone(config: Partial<PictureConfig> = {}) {
    return new Picture(Object.assign({}, this.config, config))
  }

  get x() {
    return this.config.x
  }

  get y() {
    return this.config.y
  }
  onPictureLoaded(fn: () => void) {
    this.imgLoadedFn = fn
  }
  getImgWH(img: HTMLImageElement): ShapeWH {
    const ratio = img.width / img.height
    if (this.config.height && this.config.width) {
      return {
        width: this.config.width,
        height: this.config.height
      }
    }
    if (this.config.height && !this.config.width) {
      return {
        width: this.config.height * ratio,
        height: this.config.height
      }
    }
    if (!this.config.height && this.config.width) {
      return {
        width: this.config.width * ratio,
        height: this.config.width * ratio
      }
    }
    return {
      width: img.width,
      height: img.height
    }
  }

  render(ctx?: CanvasRenderingContext2D) {
    this.ctx = ctx ?? this.ctx!
    this.path2D = new Path2D()
    const img = this.cacheImg.find(img => img.src === this.config.src)
    if (img) {
      this.renderImg(img)
    } else {
      if (!this.isImageLoaded) return
      this.isImageLoaded = false
      loadImage(this.config.src)
      .then(img => {
        this.cacheImg.push(img)
        this.renderImg(img)
        this.imgLoadedFn()
        this.isImageLoaded = true
      })
    }
  }

  private renderImg(img: HTMLImageElement) {
    const { width, height } = this.getImgWH(img)
    this.config.width = width
    this.config.height = height
    const x = this.config.x - width / 2
    const y = this.config.y - height / 2
    
    this.path2D.rect(x, y, width, height)
    this.ctx!.fillStyle = 'transparent'
    this.ctx!.filter = `opacity(${this.config.opacity})`
    this.ctx!.strokeStyle = 'transparent'
    this.ctx!.lineWidth = 0
    this.ctx!.drawImage(img, x, y, width, height)
    this.ctx!.fill(this.path2D)
  }
}