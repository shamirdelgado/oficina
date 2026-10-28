import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { useCameraFocus } from '../../state/camera'
import { useReducedMotion } from '../../state/motion'
import { lobby, lobbyWallZ } from '../../state/lobby'
import { Box, Plant } from '../primitives'
import { useOfficePalette } from '../palette'

const wallZ = lobbyWallZ
const height = 3.6
const low = 0.5
// La puerta queda alineada con el pasillo que usan los personajes (x = 2.6).
const segments: [number, number][] = [[-6.9, 2.0], [3.2, 10.0]]
const closedViews = new Set(['reception', 'visitor', 'pikachu'])

function WaitingChair({ position }: { position: [number, number, number] }) {
  const palette = useOfficePalette()
  return <group position={position} rotation={[0, Math.PI / 2, 0]}>
    <Box size={[0.8, 0.14, 0.75]} position={[0, 0.5, 0]} color={palette.purple} />
    <Box size={[0.8, 0.7, 0.14]} position={[0, 0.85, -0.32]} color={palette.purple} />
    {[-0.32, 0.32].map(x => <Box key={x} size={[0.08, 0.45, 0.6]} position={[x, 0.22, 0]} color={palette.metal} />)}
  </group>
}

export function WaitingRoom() {
  const palette = useOfficePalette()
  const wall = useRef<Group>(null)
  const { motion } = useCameraFocus()
  const reduced = useReducedMotion()

  useFrame((_, delta) => {
    if (!wall.current) return
    // En la recepción la pared tapa al equipo; en el resto de vistas baja como en Los Sims.
    const target = closedViews.has(motion.current.target) && !motion.current.following ? 1 : low / height
    const following = motion.current.following
    const goal = following === 'visitor' || following === 'pikachu' ? 1 : target
    const alpha = reduced ? 1 : 1 - Math.exp(-6 * Math.min(delta, 0.1))
    wall.current.scale.y += (goal - wall.current.scale.y) * alpha
    lobby.closed = goal === 1 && wall.current.scale.y > 0.6
  })

  return <group>
    <group ref={wall}>
      {segments.map(([from, to]) => <group key={from}>
        <Box size={[to - from, height, 0.18]} position={[(from + to) / 2, height / 2, wallZ]} color={palette.wall} />
        <Box size={[to - from, 0.14, 0.24]} position={[(from + to) / 2, 0.1, wallZ]} color={palette.wood} />
      </group>)}
      {[2.0, 3.2].map(x => <Box key={x} size={[0.14, height, 0.26]} position={[x, height / 2, wallZ]} color={palette.wood} />)}
      <Box size={[1.34, 0.6, 0.18]} position={[2.6, height - 0.3, wallZ]} color={palette.wall} />
      <Box size={[1.34, 0.1, 0.26]} position={[2.6, height - 0.6, wallZ]} color={palette.wood} />
    </group>
    <WaitingChair position={[-5.7, 0, 4.3]} />
    <WaitingChair position={[-5.7, 0, 5.3]} />
    <Box size={[0.7, 0.42, 0.9]} position={[-4.65, 0.21, 4.8]} color={palette.wood} />
    <Box size={[0.36, 0.04, 0.26]} position={[-4.7, 0.44, 4.65]} color={palette.strip} emissive={palette.strip} castShadow={false} />
    <Box size={[0.3, 0.04, 0.24]} position={[-4.6, 0.47, 4.98]} color={palette.cream} castShadow={false} />
    <Plant position={[5.9, 0, 3.5]} scale={0.8} />
  </group>
}
