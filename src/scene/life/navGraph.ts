export type Point = [number, number, number]
export const nodes = {
  entrance: [0, 0, 7.5], entryEast: [2.8, 0, 6.6], visitor: [0, 0, 6.1],
  visitorSide: [0.2, 0, 6.5], petPass: [1.05, 0, 6.35],
  reception: [2.6, 0, 3.5], corridor: [2.6, 0, 2.2],
  west: [-0.3, 0, 2.2], esiel: [-0.3, 0, 0], kalua: [4, 0, 0],
  east: [4, 0, 2.2], breakDoor: [6, 0, 2.2], coffee: [7.3, 0, -1.6],
  sofa: [9.2, 0.65, -1.3], breakBack: [6, 0, -1.8],
  officeDoor: [3.5, 0, -2.7], officeInside: [3.5, 0, -4],
  officeBack: [3.5, 0, -6.5], shamir: [1.9, 0, -5.2],
} satisfies Record<string, Point>
export type NodeId = keyof typeof nodes
const edges: [NodeId, NodeId][] = [
  ['entryEast', 'petPass'], ['petPass', 'visitorSide'],
  ['entrance', 'visitor'], ['entrance', 'entryEast'], ['entryEast', 'reception'], ['reception', 'corridor'],
  ['corridor', 'west'], ['west', 'esiel'], ['corridor', 'east'], ['east', 'kalua'],
  ['east', 'breakDoor'], ['breakDoor', 'coffee'], ['breakDoor', 'breakBack'],
  ['breakBack', 'sofa'], ['breakBack', 'coffee'], ['kalua', 'officeDoor'], ['officeDoor', 'officeInside'],
  ['officeInside', 'officeBack'], ['officeBack', 'shamir'],
]
export function path(from: NodeId, to: NodeId): NodeId[] {
  const queue: NodeId[][] = [[from]]
  const seen = new Set<NodeId>([from])
  while (queue.length) {
    const route = queue.shift()!
    const last = route[route.length - 1]
    if (last === to) return route.slice(1)
    for (const [a, b] of edges) {
      const next = a === last ? b : b === last ? a : null
      if (next && !seen.has(next)) { seen.add(next); queue.push([...route, next]) }
    }
  }
  return []
}
