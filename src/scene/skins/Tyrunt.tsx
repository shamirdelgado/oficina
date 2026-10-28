import { box, capsule, cone, Parts, sphere } from './parts'

const brown = '#8a6c5a'
const dark = '#6d5446'
const grey = '#c9c8cf'
const white = '#f4f2f0'
const orange = '#f08a24'
const mouth = '#c97a8a'

const body = [
  sphere(brown, [0, 0.42, -0.05], [0.5, 0.46, 0.68]),
  sphere(dark, [0, 0.34, -0.06], [0.42, 0.3, 0.6]),
  // Cola gruesa que termina en una púa naranja.
  capsule(brown, [0, 0.48, -0.42], [0.3, 0.34, 0.5], [-1.1, 0, 0]),
  cone(brown, [0, 0.56, -0.72], [0.16, 0.34, 0.16], [-1.35, 0, 0]),
  cone(orange, [0, 0.72, -0.5], [0.07, 0.16, 0.07], [-0.3, 0, 0]),
  ...[-1, 1].flatMap(side => [
    capsule(brown, [side * 0.2, 0.2, -0.08], [0.24, 0.32, 0.28]),
    box(white, [side * 0.2, 0.03, 0.08], [0.06, 0.05, 0.14]),
    box(white, [side * 0.27, 0.03, 0.06], [0.05, 0.05, 0.12], [0, 0.4 * side, 0]),
    capsule(dark, [side * 0.18, 0.42, 0.22], [0.1, 0.16, 0.1], [0.9, 0, 0]),
  ]),
]
const collar = [0, 1, 2, 3, 4].map(index => {
  const angle = -1.1 + index * 0.55
  return cone(white, [Math.sin(angle) * 0.24, 0.72, -0.02 + Math.cos(angle) * 0.04], [0.09, 0.26, 0.09], [-0.5, 0, -angle * 0.8])
})
const head = [
  sphere(brown, [0, 0, 0], [0.5, 0.42, 0.52]),
  sphere(brown, [0, -0.04, 0.24], [0.4, 0.3, 0.36]),
  // Banda gris de la mandíbula y boca abierta.
  box(grey, [0, -0.13, 0.12], [0.46, 0.08, 0.42]),
  box(mouth, [0, -0.1, 0.33], [0.24, 0.07, 0.12]),
  ...[-1, 1].flatMap(side => [
    sphere(white, [side * 0.17, 0.06, 0.18], [0.11, 0.12, 0.06]),
    sphere('#25202b', [side * 0.18, 0.05, 0.21], [0.05, 0.06, 0.03]),
    cone(orange, [side * 0.1, 0.24, 0.02], [0.07, 0.2, 0.07], [0.25, 0, -side * 0.15]),
    cone(white, [side * 0.08, -0.17, 0.36], [0.04, 0.07, 0.04], [Math.PI, 0, 0]),
  ]),
  cone(orange, [0, 0.27, -0.12], [0.07, 0.18, 0.07], [-0.2, 0, 0]),
]

export function TyruntVisual() {
  return <group name="tyrunt-body">
    <Parts parts={body} />
    <Parts parts={collar} />
    <group name="tyrunt-head" position={[0, 0.78, 0.26]}><Parts parts={head} /></group>
  </group>
}
