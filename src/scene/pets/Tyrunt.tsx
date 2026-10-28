import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { useLanguage } from '../../i18n'
import { actorPositions, useCameraFocus } from '../../state/camera'
import { useReducedMotion } from '../../state/motion'
import { ActorMaterials } from '../skins/parts'
import { TyruntVisual } from '../skins/Tyrunt'
import { PetLabel, showBubble } from './PetLabel'

type Spot = 'byShamir' | 'backRight' | 'backLeft' | 'middle' | 'corner' | 'front' | 'window'
// Recorridos dentro del despacho que rodean el escritorio por detrás.
const spots: Record<Spot, [number, number]> = {
  byShamir: [2.1, -6.3], backRight: [2.1, -7.4], backLeft: [-0.5, -7.4],
  middle: [-1.6, -6.0], corner: [-3.6, -6.8], front: [-4.6, -4.4], window: [-1.4, -4.2],
}
const links: [Spot, Spot][] = [
  ['byShamir', 'backRight'], ['backRight', 'backLeft'], ['backLeft', 'middle'],
  ['middle', 'corner'], ['corner', 'front'], ['front', 'window'], ['window', 'middle'],
]
const speed = 0.7

function route(from: Spot, to: Spot): Spot[] {
  const queue: Spot[][] = [[from]]
  const seen = new Set<Spot>([from])
  while (queue.length) {
    const path = queue.shift()!
    const last = path[path.length - 1]
    if (last === to) return path.slice(1)
    for (const [a, b] of links) {
      const next = a === last ? b : b === last ? a : null
      if (next && !seen.has(next)) { seen.add(next); queue.push([...path, next]) }
    }
  }
  return []
}

export function Tyrunt() {
  const group = useRef<Group>(null)
  const bubble = useRef<HTMLSpanElement>(null)
  const state = useRef({
    spot: 'byShamir' as Spot, path: [] as Spot[], wait: 6, position: [...spots.byShamir] as [number, number],
    angle: Math.PI / 2, cryUntil: 0, jump: 0, time: 0,
  })
  const { t } = useLanguage()
  const { request, focus } = useCameraFocus()
  const reduced = useReducedMotion()
  const [hover, setHover] = useState(false)

  const select = () => {
    state.current.cryUntil = state.current.time + 2
    state.current.jump = 0.5
    focus('tyrunt', 'tyrunt')
  }

  useFrame((_, elapsed) => {
    if (document.hidden || !group.current) return
    const s = state.current
    const dt = Math.min(elapsed, 0.08)
    s.time += dt
    let walking = false

    if (s.path.length) {
      const [x, z] = spots[s.path[0]]
      const dx = x - s.position[0]
      const dz = z - s.position[1]
      const distance = Math.hypot(dx, dz)
      walking = true
      s.angle = Math.atan2(dx, dz)
      if (reduced || distance < speed * dt) {
        s.position = [x, z]
        s.spot = s.path.shift()!
      } else {
        s.position[0] += dx / distance * speed * dt
        s.position[1] += dz / distance * speed * dt
      }
    } else if ((s.wait -= dt) <= 0) {
      // Casi la mitad de las veces vuelve a echarse junto a Shamir.
      const options = (Object.keys(spots) as Spot[]).filter(spot => spot !== s.spot)
      const next = Math.random() < 0.45 && s.spot !== 'byShamir' ? 'byShamir' : options[Math.floor(Math.random() * options.length)]
      s.path = route(s.spot, next)
      s.wait = next === 'byShamir' ? 14 + Math.random() * 10 : 5 + Math.random() * 6
    } else if (s.spot === 'byShamir') {
      s.angle = Math.PI
    }

    s.jump = Math.max(0, s.jump - dt)
    const bob = walking && !reduced ? Math.abs(Math.sin(s.time * 9)) * 0.06 : 0
    group.current.position.set(s.position[0], bob + Math.sin(s.jump / 0.5 * Math.PI) * 0.35, s.position[1])
    group.current.rotation.y = s.angle
    const head = group.current.getObjectByName('tyrunt-head')
    if (head && !reduced) head.rotation.x = walking ? Math.sin(s.time * 9) * 0.08 : Math.sin(s.time * 1.4) * 0.05
    actorPositions.tyrunt = [s.position[0], 0, s.position[1]]
    showBubble(bubble.current, t.petCries.tyrunt, s.cryUntil, s.time)
  })

  return <group
    ref={group}
    scale={0.8}
    onClick={event => { event.stopPropagation(); select() }}
    onPointerOver={event => { event.stopPropagation(); setHover(true) }}
    onPointerOut={() => setHover(false)}
  >
    <ActorMaterials><TyruntVisual /></ActorMaterials>
    <PetLabel ref={bubble} height={1.9} label={t.pets.tyrunt} visible={hover || request.target === 'tyrunt'} onSelect={select} />
  </group>
}
