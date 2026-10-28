import { Box } from '../primitives'
import { PlantPokemon } from '../PlantPokemon'
import { useOfficePalette } from '../palette'
export function BreakRoom() {
  const palette = useOfficePalette()
  return <group>
    <Box size={[3.3, 0.03, 6]} position={[8.1, 0.04, -0.4]} color={palette.tile} />
    <Box size={[2.8, 0.8, 0.7]} position={[8.3, 0.4, -2.9]} color={palette.wood} />
    <Box size={[0.7, 0.8, 0.55]} position={[7.6, 1.2, -2.9]} color={palette.ink} />
    <Box size={[0.4, 0.38, 0.06]} position={[7.6, 1.2, -2.59]} color={palette.metal} />
    <Box size={[0.16, 0.15, 0.16]} position={[7.6, 0.94, -2.5]} color={palette.cream} />
    <Box size={[0.9, 1.35, 0.85]} position={[9.1, 0.68, -2.85]} color={palette.cream} />
    <Box size={[0.06, 0.38, 0.08]} position={[8.8, 0.85, -2.38]} color={palette.metal} />
    <mesh position={[8.3, 1, 1.6]} castShadow><cylinderGeometry args={[0.7, 0.7, 0.12, 16]} /><meshStandardMaterial color={palette.wood} /></mesh>
    <Box size={[0.15, 1, 0.15]} position={[8.3, 0.5, 1.6]} color={palette.metal} />
    {[7.3, 9.3].map(x => <group key={x}><mesh castShadow position={[x, 0.65, 1.6]}><cylinderGeometry args={[0.3, 0.3, 0.14, 10]} /><meshStandardMaterial color={palette.purple} /></mesh><Box size={[0.12, 0.6, 0.12]} position={[x, 0.3, 1.6]} color={palette.wood} /></group>)}
    <Box size={[0.9, 0.5, 2]} position={[9.2, 0.4, -1.2]} color={palette.terracotta} />
    <Box size={[0.2, 1, 2.1]} position={[9.75, 0.75, -1.2]} color={palette.terracotta} />
    <PlantPokemon kind="bellsprout" position={[6.3, 0, -2.8]} scale={0.9} rotation={0.7} potted />
  </group>
}
