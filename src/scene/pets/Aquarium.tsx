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
import { TotodileVisual } from '../skins/Totodile'
import { PetLabel, showBubble } from './PetLabel'

// Acuario en la esquina de vidrio junto al despacho.
const center: [number, number, number] = [5.75, 0, -5.65]
const tank = { width: 1.5, depth: 3.4, height: 1.35, base: 0.75 }
const bubbleCount = 14

function Bubbles({ reduced }: { reduced: boolean }) {
  const mesh = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])
  const seeds = useMemo(() => Array.from({ length: bubbleCount }, () => ({
    x: (Math.random() - 0.5) * tank.width * 0.7, z: (Math.random() - 0.5) * tank.depth * 0.8,
    speed: 0.25 + Math.random() * 0.3, offset: Math.random(),
  })), [])
  useFrame(({ clock }) => {
    if (!mesh.current) return
    seeds.forEach((seed, index) => {
      const rise = reduced ? seed.offset : (clock.elapsedTime * seed.speed + seed.offset) % 1
      dummy.position.set(seed.x + Math.sin(rise * 9 + index) * 0.03, tank.base + 0.12 + rise * (tank.height - 0.25), seed.z)
      dummy.scale.setScalar(0.03 + rise * 0.03)
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

export function Aquarium() {
  const palette = useOfficePalette()
  const swimmer = useRef<Group>(null)
  const bubble = useRef<HTMLSpanElement>(null)
  const state = useRef({ time: 0, splashUntil: 0, jump: 0 })
  const { t } = useLanguage()
  const { request, focus } = useCameraFocus()
  const reduced = useReducedMotion()
  const [hover, setHover] = useState(false)

  const select = () => {
    state.current.splashUntil = state.current.time + 2
    state.current.jump = 0.8
    focus('totodile', 'totodile')
  }

  useFrame((_, elapsed) => {
    if (document.hidden || !swimmer.current) return
    const s = state.current
    const dt = Math.min(elapsed, 0.08)
    s.time += dt
    s.jump = Math.max(0, s.jump - dt)
    const t0 = reduced ? 0 : s.time * 0.45
    // Nada en un ocho a lo largo del acuario y de vez en cuando sube a asomarse.
    const z = Math.sin(t0) * tank.depth * 0.32
    const x = Math.sin(t0 * 2) * tank.width * 0.18
    const peek = reduced ? 0 : Math.max(0, Math.sin(s.time * 0.21) - 0.75) * 4
    const y = tank.base + 0.2 + Math.sin(t0 * 1.7) * 0.1 + peek * 0.3 + Math.sin(s.jump / 0.8 * Math.PI) * 0.3
    swimmer.current.position.set(x, y, z)
    swimmer.current.rotation.y = reduced ? Math.PI / 2 : Math.atan2(Math.cos(t0 * 2) * 2 * tank.width * 0.18, Math.cos(t0) * tank.depth * 0.32)
    swimmer.current.rotation.z = reduced ? 0 : Math.sin(s.time * 3) * 0.12
    actorPositions.totodile = [center[0] + x, y - 0.6, center[2] + z]
    showBubble(bubble.current, t.petCries.totodile, s.splashUntil, s.time)
  })

  return <group position={center}>
    {/* Mueble, agua, arena y decoración */}
    <Box size={[tank.width + 0.2, tank.base, tank.depth + 0.2]} position={[0, tank.base / 2, 0]} color={palette.wood} />
    <Box size={[tank.width, 0.12, tank.depth]} position={[0, tank.base + 0.06, 0]} color="#d9c08c" />
    <mesh position={[0, tank.base + tank.height / 2, 0]}>
      <boxGeometry args={[tank.width, tank.height, tank.depth]} />
      <meshStandardMaterial color="#3fb6d6" emissive="#1d6f86" emissiveIntensity={0.55} transparent opacity={0.32} roughness={0.1} depthWrite={false} />
    </mesh>
    {/* Marco superior abierto: desde arriba se ve el interior */}
    {[-1, 1].map(side => <Box key={`x${side}`} size={[0.08, 0.07, tank.depth + 0.08]} position={[side * tank.width / 2, tank.base + tank.height, 0]} color={palette.metal} />)}
    {[-1, 1].map(side => <Box key={`z${side}`} size={[tank.width + 0.08, 0.07, 0.08]} position={[0, tank.base + tank.height, side * tank.depth / 2]} color={palette.metal} />)}
    {[[-0.35, -1.1], [0.4, 0.3], [-0.2, 1.2]].map(([x, z], index) => <group key={index} position={[x, tank.base + 0.1, z]}>
      <mesh castShadow position={[0, 0.12, 0]}><dodecahedronGeometry args={[0.18, 0]} /><meshStandardMaterial color="#6f6a7d" flatShading /></mesh>
      {[0, 1, 2].map(leaf => <mesh key={leaf} position={[leaf * 0.09 - 0.09, 0.42, 0.12]} rotation={[0, 0, (leaf - 1) * 0.25]}>
        <coneGeometry args={[0.05, 0.6, 4]} /><meshStandardMaterial color={palette.leaf} flatShading />
      </mesh>)}
    </group>)}
    <Bubbles reduced={reduced} />
    <group
      ref={swimmer}
      scale={0.58}
      onClick={event => { event.stopPropagation(); select() }}
      onPointerOver={event => { event.stopPropagation(); setHover(true) }}
      onPointerOut={() => setHover(false)}
    >
      <ActorMaterials><TotodileVisual /></ActorMaterials>
      <PetLabel ref={bubble} height={2.2} label={t.pets.totodile} visible={hover || request.target === 'totodile'} onSelect={select} />
    </group>
  </group>
}
