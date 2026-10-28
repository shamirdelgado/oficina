import { box, cone, sphere } from './parts'
import { black, person } from './person'

const coat = '#24232a'
const fur = '#121115'
const blonde = '#f2dc8a'
export const lia = person(coat, coat, black, black)
lia.body.push(
  sphere(blonde, [0, 1.98, -0.06], [0.57, 0.35, 0.52]),
  sphere(blonde, [0, 1.35, -0.23], [0.64, 1.4, 0.3]),
  ...[-1, 1].flatMap(side => [
    sphere(blonde, [side * 0.27, 1.29, -0.05], [0.24, 1.2, 0.3]),
    box(black, [side * 0.23, 1.95, 0.16], [0.09, 0.18, 0.07], [0, 0, side * 0.2]),
  ]),
  ...Array.from({ length: 7 }, (_, i) => sphere(fur, [Math.cos(i * Math.PI / 3) * 0.24, 1.46, Math.sin(i * Math.PI / 3) * 0.16], [0.19, 0.18, 0.17])),
)
lia.arm.push(...[-1, 0, 1].map(i => sphere(fur, [i * 0.065, -0.35, 0], [0.15, 0.16, 0.25])))
lia.standing = [-0.17, 0.17].flatMap(x => [box(coat, [x, 0.3, 0], [0.3, 0.5, 0.32]), box(black, [x, 0.1, 0.05], [0.31, 0.2, 0.4])])
lia.standing.push(cone(coat, [0, 0.71, 0], [0.8, 0.67, 0.63]),
  ...Array.from({ length: 10 }, (_, i) => sphere(fur, [Math.cos(i * Math.PI / 5) * 0.35, 0.4, Math.sin(i * Math.PI / 5) * 0.26], [0.22, 0.15, 0.2])))
lia.seated.push(box(coat, [0, 0.8, 0.12], [0.7, 0.24, 0.69]))
