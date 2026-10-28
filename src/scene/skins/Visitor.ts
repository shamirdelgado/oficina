import { box, cone, sphere } from './parts'
import { person } from './person'

const blue = '#2f6fd6'
const yellow = '#f2c12e'
const black = '#1f2a24'
export const visitor = person(black, '#7fb0dc', '#ffffff', '#3d9a4f')
visitor.arm = [box(blue, [0, -0.04, 0], [0.21, 0.23, 0.25]), box('#d4a17f', [0, -0.24, 0], [0.15, 0.22, 0.17]), box('#3d9a4f', [0, -0.4, 0.01], [0.18, 0.15, 0.21]), box('#d4a17f', [0, -0.49, 0.04], [0.15, 0.06, 0.16])]
visitor.body.push(
  ...[-1, 1].flatMap(side => [box(blue, [side * 0.18, 1.2, 0.1], [0.18, 0.49, 0.29]), box(yellow, [side * 0.1, 1.2, 0.255], [0.035, 0.48, 0.025])]),
  box(yellow, [0, 0.96, 0.1], [0.55, 0.06, 0.34]),
  sphere('#11151a', [0, 1.92, -0.06], [0.53, 0.35, 0.49]),
  ...[-1, 1].flatMap(side => [0, 1, 2].map(i => cone('#11151a', [side * (0.2 + i * 0.045), 1.87 - i * 0.075, -0.03], [0.17, 0.25, 0.2], [0, 0, side * 2.25]))),
  sphere('#e2382f', [0, 2.04, 0], [0.59, 0.29, 0.55]),
  box('#e2382f', [0, 2.02, 0.26], [0.55, 0.065, 0.36]),
  box('#ffffff', [0, 2.1, 0.23], [0.32, 0.16, 0.065]),
  box('#3d9a4f', [0, 2.11, 0.27], [0.035, 0.09, 0.018], [0, 0, -0.5]),
  box('#3d9a4f', [0.035, 2.14, 0.27], [0.08, 0.025, 0.018]),
)
for (const [parts, z] of [[visitor.standing, 0], [visitor.seated, 0.44]] as const) {
  parts.push(...[-0.16, 0.16].flatMap(x => [box('#bed7ed', [x, 0.27, z], [0.26, 0.11, 0.28]), box('#1c1a22', [x, 0.075, z + 0.06], [0.26, 0.08, 0.38])]))
}
