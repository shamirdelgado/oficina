import { box, capsule, Parts, sphere } from './parts'

const yellow = '#f5d33f'
const black = '#211c29'
const brown = '#976236'
const body = [
  sphere(yellow, [0, 0.23, 0], [0.38, 0.43, 0.3]),
  ...[-1, 1].flatMap(side => [
    sphere(yellow, [side * 0.12, 0.055, 0.07], [0.15, 0.1, 0.23]),
    capsule(yellow, [side * 0.19, 0.25, 0.055], [0.16, 0.2, 0.18], [0, 0, side * 0.3]),
  ]),
  ...[0.2, 0.3].map(y => box(brown, [0, y, -0.145], [0.26, 0.035, 0.025])),
  box(brown, [0.06, 0.15, -0.22], [0.09, 0.1, 0.24], [-0.5, 0, 0]),
  box(yellow, [0.07, 0.26, -0.32], [0.09, 0.25, 0.12], [0.5, 0, 0]),
  box(yellow, [0.07, 0.37, -0.39], [0.09, 0.09, 0.25]),
  box(yellow, [0.07, 0.49, -0.49], [0.09, 0.29, 0.17], [0.45, 0, 0]),
]
const head = [
  sphere(yellow, [0, 0, 0], [0.44, 0.34, 0.33]),
  ...[-1, 1].flatMap(side => [
    sphere(black, [side * 0.087, 0.015, 0.15], [0.037, 0.045, 0.025]),
    sphere('#e2463a', [side * 0.17, -0.055, 0.113], [0.085, 0.08, 0.035]),
  ]),
]
const ear = [capsule(yellow, [0, 0.095, 0], [0.16, 0.25, 0.15]), capsule(black, [0, 0.205, 0], [0.13, 0.1, 0.13])]

export function PikachuVisual() {
  return <group name="pika-body">
    <Parts parts={body} />
    <group name="pika-head" position={[0, 0.46, 0.035]}>
      <Parts parts={head} />
      {[-1, 1].map(side => <group key={side} name={side < 0 ? 'pika-ear-left' : 'pika-ear-right'} position={[side * 0.13, 0.12, 0]} rotation={[0, 0, -side * 0.25]}><Parts parts={ear} /></group>)}
    </group>
  </group>
}
