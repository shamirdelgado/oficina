import { box, capsule, cone, Parts, sphere } from './parts'

const blue = '#4fb3c8'
const deep = '#3a8fa6'
const cream = '#f1d98c'
const red = '#c23a4c'
const mouth = '#b8606c'

const body = [
  sphere(blue, [0, 0.3, 0], [0.42, 0.5, 0.38]),
  // Pecho color crema en forma de V.
  cone(cream, [0, 0.42, 0.15], [0.2, 0.28, 0.06], [Math.PI, 0, 0]),
  ...[-1, 1].flatMap(side => [
    capsule(blue, [side * 0.13, 0.06, 0.04], [0.16, 0.2, 0.2]),
    capsule(deep, [side * 0.24, 0.38, 0.06], [0.11, 0.18, 0.11], [0.3, 0, side * 0.8]),
  ]),
  capsule(blue, [0, 0.16, -0.26], [0.16, 0.24, 0.3], [-1.2, 0, 0]),
  ...[0.5, 0.36, 0.2].map((y, index) => cone(red, [0, y, -0.2 - index * 0.06], [0.07, 0.15, 0.07], [-0.6, 0, 0])),
  cone(red, [0, 0.12, -0.46], [0.06, 0.14, 0.06], [-1.2, 0, 0]),
]
const head = [
  sphere(blue, [0, 0, 0], [0.36, 0.3, 0.34]),
  // Mandíbula grande y abierta, como en la referencia.
  box(blue, [0, 0.06, 0.24], [0.26, 0.1, 0.32]),
  box(mouth, [0, -0.02, 0.22], [0.2, 0.06, 0.28]),
  box(deep, [0, -0.08, 0.2], [0.24, 0.07, 0.26]),
  ...[-1, 1].flatMap(side => [
    sphere('#ffffff', [side * 0.12, 0.09, 0.1], [0.09, 0.1, 0.06]),
    sphere('#b3243a', [side * 0.13, 0.09, 0.13], [0.05, 0.06, 0.03]),
    cone('#ffffff', [side * 0.08, 0.0, 0.36], [0.03, 0.05, 0.03], [Math.PI, 0, 0]),
  ]),
]

export function TotodileVisual() {
  return <group name="totodile-body">
    <Parts parts={body} />
    <group name="totodile-head" position={[0, 0.64, 0.04]}><Parts parts={head} /></group>
  </group>
}
