import { Box, Chair, Desk, Plant, palette } from '../primitives'

function Glass({ position, width, rotation = 0 }: {
  position: [number, number, number]; width: number; rotation?: number
}) {
  return <group position={position} rotation={[0, rotation, 0]}>
    <mesh receiveShadow>
      <boxGeometry args={[width, 2.9, 0.045]} />
      <meshStandardMaterial color="#b6cbd0" transparent opacity={0.16} roughness={0.2} depthWrite={false} />
    </mesh>
    <Box size={[width, 0.055, 0.08]} position={[0, 1.45, 0]} color={palette.metal} />
    <Box size={[0.055, 2.9, 0.08]} position={[-width / 2, 0, 0]} color={palette.metal} />
    <Box size={[0.055, 2.9, 0.08]} position={[width / 2, 0, 0]} color={palette.metal} />
  </group>
}

export function BossOffice() {
  return <group>
    <Box size={[13.8, 0.035, 4.6]} position={[0, 0.03, -5.6]} color="#e2d3c4" />
    <Glass position={[-2.2, 1.5, -3.25]} width={9.4} />
    <Glass position={[5.6, 1.5, -3.25]} width={2.6} />
    <group position={[2.5, 0, -3.25]} rotation={[0, Math.PI / 2, 0]}>
      <Glass position={[0.9, 1.5, 0]} width={1.8} />
      <Box size={[0.08, 0.4, 0.12]} position={[1.6, 1.35, 0.1]} color={palette.purple} />
    </group>
    <Glass position={[6.9, 1.5, -5.65]} width={4.8} rotation={Math.PI / 2} />
    <group position={[0.6, 0, -5.2]} rotation={[0, Math.PI / 2, 0]}><Desk position={[0, 0, 0]} executive /></group>
    <group position={[1.9, 0, -5.2]} rotation={[0, -Math.PI / 2, 0]}><Chair position={[0, 0, 0]} /></group>
    <Plant position={[-5.6, 0, -6.6]} scale={1.2} />
    <Box size={[2, 0.7, 0.65]} position={[5.2, 0.35, -7.3]} color={palette.wood} />
    <Plant position={[5.2, 0.7, -7.3]} scale={0.6} />
  </group>
}
