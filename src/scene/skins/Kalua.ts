import { box, cone, sphere, torus } from './parts'
import { black, collar, emblem, person, white } from './person'

const hair = '#d4317a'
export const kalua = person(white, black, black, black)
kalua.arm = [box(white, [0, -0.065, 0], [0.19, 0.22, 0.23]), box(black, [0, -0.31, 0], [0.16, 0.34, 0.19]), sphere(black, [0, -0.5, 0.02], [0.19, 0.2, 0.2])]
kalua.body.push(
  box(black, [0, 0.98, 0], [0.47, 0.18, 0.36]), ...collar(), ...emblem([0, 1.29, 0.19], 1.5),
  sphere(hair, [0, 2, -0.05], [0.55, 0.33, 0.5]),
  sphere(hair, [0, 1.9, -0.31], [0.6, 0.48, 0.64]),
  sphere(hair, [0, 1.68, -0.58], [0.55, 0.56, 0.59], [-0.4, 0, 0]),
  sphere(hair, [0, 1.4, -0.78], [0.42, 0.43, 0.48]),
  torus(hair, [0, 1.4, -0.95], [0.35, 0.46, 0.48], [0, Math.PI / 2, 0]),
  ...[-1, 1].map(side => sphere('#3fae4a', [side * 0.25, 1.67, 0.055], [0.09, 0.12, 0.09])),
)
kalua.standing.push(cone(white, [0, 0.8, 0], [0.7, 0.27, 0.58]))
kalua.seated.push(cone(white, [0, 0.84, 0.1], [0.72, 0.22, 0.83]))
