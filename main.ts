import { MyCanvas } from "./MyCanvas";
import { Circle } from "./Shape/Circle";
import { Line } from "./Shape/Line";
import { Rect } from "./Shape/Rect";
import { Polygon } from "./Shape/Polygon";
import { EditMod } from "./utils/EditMod";

const canvs = new MyCanvas(document.querySelector<HTMLElement>('#canvas')!)

const rect1 = new Rect({
  x: 100,
  y: 100,
  width: 100,
  height: 100,
  fill: 'red',
  stroke: 'blue',
  strokeWidth: 2,
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
const polygonPlus = new EditMod(polygon)
canvs.add(polygonPlus)
const circlePlus = new EditMod(circle)
canvs.add(circlePlus)
const rectPlus = new EditMod(rect1)
canvs.add(rectPlus)
