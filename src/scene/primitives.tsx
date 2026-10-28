import type { ThreeElements } from '@react-three/fiber'
import { useOfficePalette } from './palette'
import { CodeScreen } from './CodeScreen'
import { DeskLamp } from './DeskLamp'
import { Pokeball } from './Pokeball'
import type { BallKind } from './Pokeball'
import { LightPool } from './LightPool'

export { palette } from './palette'

type Position = [number, number, number]
export function Box({ size, color, emissive, ...props }: Omit<ThreeElements['mesh'], 'scale'> & {
  size: Position; color: string; emissive?: string
}) {
  return <mesh castShadow receiveShadow {...props}>
    <boxGeometry args={size} />
    <meshStandardMaterial color={color} emissive={emissive} roughness={0.8} flatShading />
  </mesh>
}

export function Plant({ position, scale = 1 }: { position: Position; scale?: number }) {
  const palette = useOfficePalette()
  return <group position={position} scale={scale}>
    <mesh castShadow position={[0, 0.32, 0]}>
      <cylinderGeometry args={[0.32, 0.24, 0.64, 8]} />
      <meshStandardMaterial color={palette.terracotta} flatShading />
    </mesh>
    {[0, 1, 2, 3, 4].map(index => <mesh key={index} castShadow
      position={[Math.sin(index * 2.4) * 0.2, 0.95 + index * 0.12, Math.cos(index * 2.4) * 0.2]}
      rotation={[0.3, index, 0.35]} scale={[0.22, 0.55, 0.17]}>
      <capsuleGeometry args={[1, 0.5, 2, 5]} />
      <meshStandardMaterial color={index % 2 ? palette.leafLight : palette.leaf} flatShading />
    </mesh>)}
  </group>
}

export function Desk({ position, executive = false, code = false, ball = 'poke' }: {
  position: Position; executive?: boolean; code?: boolean; ball?: BallKind
}) {
  const palette = useOfficePalette()
  const width = executive ? 3.4 : 2.8
  return <group position={position}>
    <Box size={[width, 0.15, 1.45]} position={[0, 1.25, 0]} color={palette.wood} />
    {[-1, 1].map(side => <Box key={side} size={[0.16, 1.2, 1.15]}
      position={[side * (width / 2 - 0.22), 0.6, 0]} color={palette.cream} />)}
    <Box size={[0.12, 0.38, 0.12]} position={[0, 1.48, -0.34]} color={palette.metal} />
    <Box size={[0.55, 0.05, 0.32]} position={[0, 1.36, -0.34]} color={palette.metal} />
    <group position={[0, 1.95, -0.4]} rotation={[0, -0.45, 0]}>
      <Box size={[1.18, 0.75, 0.09]} color={palette.ink} />
      {code ? <CodeScreen /> : <Box size={[1.04, 0.6, 0.015]} position={[0, 0, 0.055]}
        color={executive ? palette.strip : palette.screen} emissive={executive ? palette.strip : palette.screen} castShadow={false} />}
    </group>
    <LightPool position={[0, 1.331, 0.04]} size={[1.45, 1.05]}
      color={executive ? palette.strip : palette.screen} intensity={0.35} />
    <Box size={[0.78, 0.05, 0.29]} position={[0, 1.36, 0.28]} color={palette.cream} />
    <Box size={[0.2, 0.06, 0.28]} position={[0.7, 1.37, 0.28]} color={palette.purple} />
    <DeskLamp position={[-width / 2 + 0.35, 1.328, -0.05]} />
    <Pokeball position={[width / 2 - 0.28, 1.495, -0.35]} kind={ball} />
  </group>
}

export function Chair({ position }: { position: Position }) {
  const palette = useOfficePalette()
  return <group position={position}>
    <Box size={[0.9, 0.16, 0.85]} position={[0, 0.65, 0]} color={palette.purple} />
    <Box size={[0.9, 0.9, 0.15]} position={[0, 1.12, -0.4]} color={palette.purple} />
    <Box size={[0.13, 0.55, 0.13]} position={[0, 0.3, 0]} color={palette.metal} />
    <Box size={[0.85, 0.1, 0.14]} position={[0, 0.1, 0]} color={palette.metal} />
    <Box size={[0.14, 0.1, 0.85]} position={[0, 0.1, 0]} color={palette.metal} />
  </group>
}
