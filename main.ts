import MyCanvas from "./MyCanvas";
import { Circle } from "./Shape/Circle";
import { Line } from "./Shape/Line";
import { Rect } from "./Shape/Rect";
import { Polygon } from "./Shape/Polygon";
import { EditMod } from "./mod/EditMod";
import { Picture } from "./Shape/Picture";
import PaintMod from "./mod/PaintMod";

const canvs = new MyCanvas(document.querySelector<HTMLElement>('#canvas')!)

const rect1 = new Rect({
  x: 100,
  y: 100,
  width: 100,
  height: 100,
  fill: 'red',
  stroke: 'blue',
  strokeWidth: 1,
  radius: [10, 20],
  draggable: true
})

const circle = new Circle({
  x: 300,
  y: 300,
  radius: 50,
  fill: 'red',
  draggable: true
})

const polygon = new Polygon({
  path: [
    { x: 150, y: 300 },
    { x: 250, y: 250 },
    { x: 200, y: 400 },
  ],
  fill: 'blue'
})

const line = new Line({
  path: [
    { x: 450, y: 400 },
    { x: 550, y: 450 },
    { x: 400, y: 600 },
  ],
})

const image = new Picture({
  src: 'https://mdn.github.io/shared-assets/images/examples/rhino.jpg',
  x: 300,
  y: 100,
  draggable: true,
  zIndex: 3,
})

const imagePlus = new EditMod(image)
canvs.add(image)

const linePlus = new EditMod(line)
canvs.add(linePlus)

const polygonPlus = new EditMod(polygon)
canvs.add(polygonPlus)

const circlePlus = new EditMod(circle, { borderStyle: 'dotted' })
canvs.add(circlePlus)

const rectPlus = new EditMod(rect1)
canvs.add(rectPlus)



const paint = new PaintMod(canvs)

document.querySelector<HTMLButtonElement>('.circle').addEventListener('click', () => {
  paint.drawCircle()
})
document.querySelector<HTMLButtonElement>('.ellipse').addEventListener('click', () => {
  paint.drawCircle({ ellipse: true })
})
document.querySelector<HTMLButtonElement>('.rect').addEventListener('click', () => {
  paint.drawRect()
})
document.querySelector<HTMLButtonElement>('.square').addEventListener('click', () => {
  paint.drawRect({ square: true })
})
document.querySelector<HTMLButtonElement>('.line').addEventListener('click', () => {
  paint.drawLine()
})
