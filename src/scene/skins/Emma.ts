import { box, cone, sphere, torus } from './parts'
import { collar, person } from './person'

const pink = '#f2a0a8'
const hair = '#e8607a'
export const emma = person(pink, '#f7f3f5', pink)
emma.body.push(
  ...collar('#ffffff'),
  sphere(hair, [0, 1.94, -0.04], [0.53, 0.38, 0.46]),
  box(hair, [0, 1.94, 0.2], [0.4, 0.12, 0.09]),
  ...[-1, 1].map(side => torus(hair, [side * 0.33, 1.83, -0.03], [0.46, 0.5, 0.35])),
  box('#ffffff', [0, 2.12, 0], [0.42, 0.18, 0.31]),
  sphere('#d8312f', [0, 2.14, 0.163], [0.11, 0.1, 0.025]),
  box('#ffffff', [0, 2.115, 0.18], [0.1, 0.04, 0.025]),
  box('#1c1a22', [0, 2.135, 0.182], [0.1, 0.012, 0.02]),
  sphere('#ffffff', [0, 2.135, 0.2], [0.035, 0.035, 0.02]),
)
emma.standing.push(cone('#f7f3f5', [0, 0.85, 0], [0.83, 0.48, 0.72]), cone(pink, [0, 0.63, 0], [0.85, 0.08, 0.74]))
emma.seated.push(cone('#f7f3f5', [0, 0.87, 0.12], [0.84, 0.3, 0.91]), box(pink, [0, 0.75, 0.36], [0.78, 0.08, 0.1]))
