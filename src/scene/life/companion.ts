import type { Actor } from './routines'
import type { Point } from './navGraph'

type Footstep = { point: Point; angle: number }
export type VisitorTrail = Footstep[]

export function followVisitor(companion: Actor, visitor: Actor, trail: VisitorTrail, dt: number, reduced: boolean) {
  companion.visible = visitor.visible
  companion.node = visitor.node
  companion.angle = visitor.angle
  companion.fade = visitor.fade
  const last = trail[trail.length - 1]
  if (!last || Math.hypot(last.point[0] - visitor.position[0], last.point[2] - visitor.position[2]) > 0.035) {
    trail.push({ point: [...visitor.position], angle: visitor.angle })
    if (trail.length > 32) trail.shift()
  }
  let step: Footstep = { point: visitor.position, angle: visitor.angle }
  if (visitor.route.length) {
    let distance = 0
    for (let i = trail.length - 1; i > 0; i--) {
      const a = trail[i].point
      const b = trail[i - 1].point
      distance += Math.hypot(a[0] - b[0], a[2] - b[2])
      step = trail[i - 1]
      if (distance >= 0.3) break
    }
  }
  const behind = visitor.route.length ? 0 : 0.25
  const destination: Point = [
    step.point[0] - Math.cos(step.angle) * 0.62 - Math.sin(step.angle) * behind,
    step.point[1],
    step.point[2] + Math.sin(step.angle) * 0.62 - Math.cos(step.angle) * behind,
  ]
  const alpha = reduced || !last ? 1 : 1 - Math.exp(-12 * dt)
  for (const axis of [0, 1, 2] as const) companion.position[axis] += (destination[axis] - companion.position[axis]) * alpha
  return visitor.route.length > 0 || Math.hypot(destination[0] - companion.position[0], destination[2] - companion.position[2]) > 0.04
}
