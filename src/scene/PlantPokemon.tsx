import { useRef } from 'react'
import type { ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { useReducedMotion } from '../state/motion'
import { ActorMaterials, box, capsule, cone, Parts, sphere } from './skins/parts'
import { useOfficePalette } from './palette'

const petals = '#d9707e'
const spots = '#f6dde0'
const vileplume = [
  // Cuerpo azul con patitas y bracitos.
  sphere('#4a5a9c', [0, 0.32, 0], [0.5, 0.56, 0.46]),
  ...[-1, 1].flatMap(side => [
    capsule('#4a5a9c', [side * 0.13, 0.06, 0.04], [0.14, 0.18, 0.16]),
    capsule('#4a5a9c', [side * 0.27, 0.34, 0.02], [0.1, 0.18, 0.1], [0, 0, side * 1.1]),
    sphere('#1f1a22', [side * 0.08, 0.38, 0.22], [0.04, 0.03, 0.02]),
    sphere('#e98a8a', [side * 0.15, 0.32, 0.2], [0.05, 0.04, 0.02]),
  ]),
  // Flor grande de cuatro pétalos con manchas.
  ...[0, 1, 2, 3].flatMap(index => {
    const angle = index * Math.PI / 2 + Math.PI / 4
    const x = Math.cos(angle) * 0.36
    const z = Math.sin(angle) * 0.36
    return [
      sphere(petals, [x, 0.74, z], [0.62, 0.16, 0.62]),
      sphere(spots, [x * 1.25, 0.82, z * 1.25], [0.12, 0.05, 0.1]),
      sphere(spots, [x * 0.8, 0.82, z * 0.7], [0.08, 0.04, 0.08]),
    ]
  }),
  cone('#b9773f', [0, 0.84, 0], [0.24, 0.14, 0.24]),
  sphere('#6b3d22', [0, 0.9, 0], [0.18, 0.04, 0.18]),
]

const bellsprout = [
  // Tallo delgado, dos hojas y cabeza amarilla con boca rosada.
  capsule('#9b8a6a', [0, 0.36, 0], [0.06, 0.62, 0.06]),
  ...[-1, 1].map(side => sphere('#8fc67a', [side * 0.2, 0.34, 0], [0.34, 0.05, 0.16], [0, 0, side * 0.35])),
  sphere('#eae37a', [0, 0.82, 0.04], [0.26, 0.3, 0.24]),
  sphere('#eae37a', [0, 0.7, 0.14], [0.18, 0.16, 0.2]),
  sphere('#e6a7ad', [0, 0.66, 0.26], [0.16, 0.14, 0.06]),
  sphere('#3a2a30', [0, 0.66, 0.28], [0.09, 0.08, 0.03]),
  ...[-1, 1].map(side => sphere('#1f1a22', [side * 0.08, 0.86, 0.15], [0.035, 0.04, 0.02])),
  ...[-1, 1].map(side => box('#9b8a6a', [side * 0.12, 0.03, 0], [0.22, 0.03, 0.03], [0, 0, side * 0.3])),
]

function Pot({ children }: { children: ReactNode }) {
  const palette = useOfficePalette()
  return <group>
    <mesh castShadow position={[0, 0.25, 0]}>
      <cylinderGeometry args={[0.3, 0.22, 0.5, 8]} />
      <meshStandardMaterial color={palette.terracotta} flatShading />
    </mesh>
    <group position={[0, 0.5, 0]}>{children}</group>
  </group>
}

export function PlantPokemon({ kind, position, scale = 1, rotation = 0, potted = false }: {
  kind: 'vileplume' | 'bellsprout'; position: [number, number, number]; scale?: number; rotation?: number; potted?: boolean
}) {
  const sway = useRef<Group>(null)
  const reduced = useReducedMotion()
  const seed = useRef(Math.random() * 10)
  useFrame(({ clock }) => {
    if (!sway.current || reduced) return
    const time = clock.elapsedTime + seed.current
    // Balanceo suave, como si respiraran.
    sway.current.rotation.z = Math.sin(time * (kind === 'bellsprout' ? 1.6 : 0.9)) * (kind === 'bellsprout' ? 0.09 : 0.04)
    sway.current.scale.y = 1 + Math.sin(time * 1.2) * 0.02
  })
  const figure = <group ref={sway}>
    <ActorMaterials><Parts parts={kind === 'vileplume' ? vileplume : bellsprout} /></ActorMaterials>
  </group>
  return <group position={position} scale={scale} rotation={[0, rotation, 0]}>
    {potted ? <Pot>{figure}</Pot> : figure}
  </group>
}
