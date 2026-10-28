import { box, cone, sphere } from './parts'
import { black, collar, emblem, person, white } from './person'

const hair = '#8a7fe0'
export const esiel = person(white, white, black, black)
esiel.body.push(
  box(black, [0, 0.98, 0], [0.49, 0.17, 0.36]),
  box('#c890d8', [0, 0.85, 0], [0.5, 0.09, 0.37]),
  ...collar(), ...emblem([0, 1.29, 0.19], 1.5),
  sphere(hair, [0, 1.98, -0.04], [0.56, 0.3, 0.49]),
  ...[-1, 1].map(side => sphere(hair, [side * 0.16, 1.96, 0.13], [0.27, 0.27, 0.28], [0, 0, side * 0.35])),
  ...[-1, 1].map(side => cone(hair, [side * 0.19, 1.85, 0.2], [0.14, 0.24, 0.13], [0, 0, Math.PI + side * 0.35])),
)
for (const [parts, z] of [[esiel.standing, 0], [esiel.seated, 0.44]] as const) {
  parts.push(...[-0.16, 0.16].map(x => box(black, [x, 0.23, z], [0.24, 0.31, 0.27])))
}
