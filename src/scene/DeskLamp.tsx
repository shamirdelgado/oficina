import { DoubleSide } from 'three'
import { useOfficePalette } from './palette'
import { LightPool } from './LightPool'

export function DeskLamp({ position }: { position: [number, number, number] }) {
  const palette = useOfficePalette()
  return <group position={position}>
    <mesh position={[0, 0.035, 0]} castShadow>
      <cylinderGeometry args={[0.16, 0.19, 0.06, 10]} />
      <meshStandardMaterial color={palette.metal} />
    </mesh>
    <mesh position={[0, 0.35, 0]} castShadow>
      <cylinderGeometry args={[0.025, 0.025, 0.65, 6]} />
      <meshStandardMaterial color={palette.wood} />
    </mesh>
    <mesh position={[0, 0.68, 0]} castShadow>
      <cylinderGeometry args={[0.1, 0.26, 0.25, 10, 1, true]} />
      <meshStandardMaterial color={palette.purple} side={DoubleSide} />
    </mesh>
    <mesh position={[0, 0.555, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.23, 16]} />
      <meshBasicMaterial color="#ffd29b" side={DoubleSide} toneMapped={false} />
    </mesh>
    <LightPool position={[0.14, 0.005, 0.08]} size={[0.95, 1.15]} color="#ffd29b" intensity={0.85} />
  </group>
}
