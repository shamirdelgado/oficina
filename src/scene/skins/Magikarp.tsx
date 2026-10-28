import { box, capsule, cone, Parts, sphere } from './parts'

const red = '#e8573c'
const belly = '#f0a070'
const fin = '#f4efe8'
const gold = '#f2b84b'

// Mira hacia +z: boca adelante, cola atrás.
const body = [
  sphere(red, [0, 0, 0], [0.62, 0.66, 0.78]),
  sphere(belly, [0, -0.14, 0.06], [0.42, 0.34, 0.6]),
  sphere('#f2a1a8', [0, -0.04, 0.4], [0.2, 0.2, 0.08]),
  sphere('#5a2a2e', [0, -0.04, 0.43], [0.11, 0.11, 0.03]),
  ...[-1, 1].flatMap(side => [
    sphere('#ffffff', [side * 0.24, 0.1, 0.22], [0.2, 0.22, 0.12]),
    sphere('#1f1a22', [side * 0.29, 0.1, 0.25], [0.06, 0.07, 0.04]),
    // Bigotes largos y amarillos.
    capsule(gold, [side * 0.16, -0.18, 0.36], [0.05, 0.42, 0.05], [0.5, 0, side * 0.4]),
    // Aletas laterales blancas.
    box(fin, [side * 0.32, -0.08, -0.02], [0.04, 0.24, 0.3], [0.3, 0, side * 0.5]),
  ]),
  // Corona dorada y aleta de abajo.
  ...[-0.12, 0.04, 0.2].map((z, index) => cone(gold, [0, 0.36 + (index === 1 ? 0.06 : 0), z - 0.08], [0.05, 0.26, 0.12], [-0.3 + index * 0.25, 0, 0])),
  cone(gold, [0, -0.36, -0.06], [0.05, 0.18, 0.12], [Math.PI, 0, 0]),
]
const tail = [
  box(fin, [0, 0.12, -0.18], [0.05, 0.34, 0.3], [0.5, 0, 0]),
  box(fin, [0, -0.12, -0.18], [0.05, 0.34, 0.3], [-0.5, 0, 0]),
  box(red, [0, 0, -0.03], [0.07, 0.16, 0.12]),
]

export function MagikarpVisual() {
  return <group name="magikarp-body">
    <Parts parts={body} />
    <group name="magikarp-tail" position={[0, 0, -0.38]}><Parts parts={tail} /></group>
  </group>
}
