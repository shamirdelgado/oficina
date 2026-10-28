import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group, InstancedMesh } from 'three'
import { Object3D } from 'three'
import { useLanguage } from '../../i18n'
import { actorPositions, useCameraFocus } from '../../state/camera'
import { useReducedMotion } from '../../state/motion'
import { Box } from '../primitives'
import { useOfficePalette } from '../palette'
import { ActorMaterials } from '../skins/parts'
import { MagikarpVisual } from '../skins/Magikarp'
import { PetLabel, showBubble } from './PetLabel'

// Pecera grande en la esquina libre detrás de la sala de descanso.
const center: [number, number, number] = [8.55, 0, -5.8]
const tank = { width: 2.5, depth: 3.7, height: 1.7, base: 0.6 }
const bubbleCount = 22

function Bubbles({ reduced }: { reduced: boolean }) {
  const mesh = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])
  const seeds = useMemo(() => Array.from({ length: bubbleCount }, () => ({
    x: (Math.random() - 0.5) * tank.width * 0.75, z: (Math.random() - 0.5) * tank.depth * 0.85,
    speed: 0.2 + Math.random() * 0.3, offset: Math.random(),
  })), [])
  useFrame(({ clock }) => {
    if (!mesh.current) return
    seeds.forEach((seed, index) => {
      const rise = reduced ? seed.offset : (clock.elapsedTime * seed.speed + seed.offset) % 1
      dummy.position.set(seed.x + Math.sin(rise * 9 + index) * 0.04, tank.base + 0.15 + rise * (tank.height - 0.3), seed.z)
      dummy.scale.setScalar(0.03 + rise * 0.035)
      dummy.updateMatrix()
      mesh.current!.setMatrixAt(index, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })
  return <instancedMesh ref={mesh} args={[undefined, undefined, bubbleCount]}>
    <sphereGeometry args={[1, 6, 4]} />
    <meshBasicMaterial color="#d9fbff" transparent opacity={0.7} />
  </instancedMesh>
}

function Decor() {
  const palette = useOfficePalette()
  const rocks: [number, number, number][] = [[-0.7, 0.2, -1.2], [0.6, 0.26, -0.5], [-0.4, 0.18, 0.9], [0.75, 0.22, 1.3]]
  return <>
    {rocks.map(([x, size, z], index) => <mesh key={index} castShadow position={[x, tank.base + 0.12 + size * 0.5, z]}>
      <dodecahedronGeometry args={[size, 0]} />
      <meshStandardMaterial color={index % 2 ? '#7a7488' : '#615c70'} flatShading />
    </mesh>)}
    {[[-0.85, -0.3], [0.2, -1.4], [0.9, 0.4], [-0.6, 1.5], [0.1, 0.9]].map(([x, z], index) => <group key={index} position={[x, tank.base + 0.12, z]}>
      {[0, 1, 2].map(leaf => <mesh key={leaf} position={[leaf * 0.1 - 0.1, 0.35 + (leaf % 2) * 0.1, 0]} rotation={[0, 0, (leaf - 1) * 0.25]}>
        <coneGeometry args={[0.06, 0.7 + (leaf % 2) * 0.2, 4]} /><meshStandardMaterial color={leaf % 2 ? palette.leafLight : palette.leaf} flatShading />
      </mesh>)}
    </group>)}
  </>
}

export function Aquarium() {
  const palette = useOfficePalette()
  const swimmer = useRef<Group>(null)
  const bubble = useRef<HTMLSpanElement>(null)
  const state = useRef({ time: 0, splashUntil: 0, leap: 0, nextLeap: 9 })
  const { t } = useLanguage()
  const { request, focus } = useCameraFocus()
  const reduced = useReducedMotion()
  const [hover, setHover] = useState(false)

  const leapNow = () => {
    state.current.leap = 1.1
    state.current.splashUntil = state.current.time + 2
  }
  const select = () => {
    leapNow()
    focus('magikarp', 'magikarp')
  }

  useFrame((_, elapsed) => {
    if (document.hidden || !swimmer.current) return
    const s = state.current
    const dt = Math.min(elapsed, 0.08)
    s.time += dt
    // Cada tanto salta fuera del agua, como su famoso Salpicadura.
    if (!reduced && (s.nextLeap -= dt) <= 0) {
      leapNow()
      s.nextLeap = 12 + Math.random() * 14
    }
    s.leap = Math.max(0, s.leap - dt)

    const t0 = reduced ? 0 : s.time * 0.35
    const z = Math.sin(t0) * tank.depth * 0.34
    const x = Math.sin(t0 * 2) * tank.width * 0.22
    const arc = Math.sin((1 - s.leap / 1.1) * Math.PI) * (s.leap > 0 ? 1 : 0)
    const y = tank.base + 0.75 + Math.sin(t0 * 1.7) * 0.18 + arc * 1.25
    swimmer.current.position.set(x, y, z)
    swimmer.current.rotation.y = reduced ? Math.PI / 2 : Math.atan2(Math.cos(t0 * 2) * 2 * tank.width * 0.22, Math.cos(t0) * tank.depth * 0.34)
    swimmer.current.rotation.x = s.leap > 0 ? -Math.PI * 2 * (1 - s.leap / 1.1) : 0
    const tail = swimmer.current.getObjectByName('magikarp-tail')
    if (tail && !reduced) tail.rotation.y = Math.sin(s.time * (s.leap > 0 ? 22 : 7)) * 0.45
    actorPositions.magikarp = [center[0] + x, y - 0.6, center[2] + z]
    showBubble(bubble.current, t.petCries.magikarp, s.splashUntil, s.time)
  })

  return <group position={center}>
    <Box size={[tank.width + 0.24, tank.base, tank.depth + 0.24]} position={[0, tank.base / 2, 0]} color={palette.wood} />
    <Box size={[tank.width, 0.14, tank.depth]} position={[0, tank.base + 0.07, 0]} color="#d9c08c" />
    <mesh position={[0, tank.base + tank.height / 2, 0]}>
      <boxGeometry args={[tank.width, tank.height, tank.depth]} />
      <meshStandardMaterial color="#3fb6d6" emissive="#1d6f86" emissiveIntensity={0.55} transparent opacity={0.3} roughness={0.1} depthWrite={false} />
    </mesh>
    {/* Marco abierto arriba para ver el interior desde la cámara */}
    {[-1, 1].map(side => <Box key={`x${side}`} size={[0.08, 0.08, tank.depth + 0.08]} position={[side * tank.width / 2, tank.base + tank.height, 0]} color={palette.metal} />)}
    {[-1, 1].map(side => <Box key={`z${side}`} size={[tank.width + 0.08, 0.08, 0.08]} position={[0, tank.base + tank.height, side * tank.depth / 2]} color={palette.metal} />)}
    {[-1, 1].flatMap(sx => [-1, 1].map(sz => <Box key={`${sx}${sz}`} size={[0.08, tank.height, 0.08]} position={[sx * tank.width / 2, tank.base + tank.height / 2, sz * tank.depth / 2]} color={palette.metal} />))}
    <Decor />
    <Bubbles reduced={reduced} />
    <group
      ref={swimmer}
      scale={0.55}
      onClick={event => { event.stopPropagation(); select() }}
      onPointerOver={event => { event.stopPropagation(); setHover(true) }}
      onPointerOut={() => setHover(false)}
    >
      <ActorMaterials><MagikarpVisual /></ActorMaterials>
      <PetLabel ref={bubble} height={1.6} label={t.pets.magikarp} visible={hover || request.target === 'magikarp'} onSelect={select} />
    </group>
  </group>
}
