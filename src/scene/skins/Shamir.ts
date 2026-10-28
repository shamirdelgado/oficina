import { box, cone, sphere } from './parts'
import { black, collar, emblem, person } from './person'

const coat = '#2a2a2e'
export const shamir = person(coat, black, black, black)
shamir.body.push(
  sphere('#2b211c', [0, 1.99, -0.06], [0.49, 0.23, 0.5]),
  box('#2b211c', [0, 1.99, 0.1], [0.4, 0.13, 0.24], [-0.25, 0, 0]),
  ...collar('#d6d8dc'), box('#17171c', [0, 0.96, 0], [0.55, 0.11, 0.4]),
  box('#c99a3b', [0, 0.96, 0.21], [0.13, 0.1, 0.035]),
  ...[-1, 1].flatMap(side => [
    box('#d6d8dc', [side * 0.19, 1.12, 0.22], [0.12, 0.7, 0.06], [0, 0, side * 0.07]),
    ...emblem([side * 0.21, 0.85, 0.258], 0.6),
  ]),
)
shamir.standing.push(cone(coat, [0, 0.73, -0.025], [0.72, 0.52, 0.58]))
shamir.seated.push(box(coat, [0, 0.78, 0.15], [0.59, 0.19, 0.71]))
