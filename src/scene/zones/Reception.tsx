import { Box, Plant } from '../primitives'
import { useOfficePalette } from '../palette'
import { Pokeball } from '../Pokeball'
import { DeskLamp } from '../DeskLamp'
import { useCameraFocus } from '../../state/camera'

export function Reception() {
  const palette = useOfficePalette()
  const { focus } = useCameraFocus()
  return <group>
    <Box size={[4.2, 1.6, 1.25]} position={[-0.5, 0.8, 4.9]} color={palette.cream} onClick={() => focus('reception')} />
    <Box size={[4.4, 0.16, 1.4]} position={[-0.5, 1.64, 4.9]} color={palette.wood} />
    <Box size={[3.6, 0.8, 0.03]} position={[-0.5, 0.86, 5.54]} color={palette.terracotta} />
    <Box size={[0.8, 0.5, 0.08]} position={[-1.3, 1.96, 4.8]} color={palette.ink} />
    <Box size={[0.68, 0.38, 0.01]} position={[-1.3, 1.96, 4.845]}
      color={palette.strip} emissive={palette.strip} castShadow={false} />
    <Pokeball position={[0.85, 1.89, 4.85]} />
    <DeskLamp position={[-2.25, 1.723, 4.85]} />
    <group position={[4.4, 0, 5.3]}>
      <Box size={[1.5, 0.45, 3.2]} position={[0, 0.5, 0]} color={palette.terracotta} />
      <Box size={[0.25, 0.95, 3.2]} position={[0.65, 0.95, 0]} color={palette.terracotta} />
      <Box size={[1.5, 0.65, 0.22]} position={[0, 0.85, 1.5]} color={palette.terracotta} />
      <Box size={[1.5, 0.65, 0.22]} position={[0, 0.85, -1.5]} color={palette.terracotta} />
      <Box size={[0.5, 0.12, 0.6]} position={[0, 0.85, 0.7]} color={palette.purple} />
    </group>
    <Plant position={[-5.7, 0, 6.5]} />
    <Plant position={[4.8, 0, 2.9]} scale={0.8} />
    <Box size={[3.8, 0.025, 2.4]} position={[-0.4, 0.04, 6.5]} color={palette.rug} />
  </group>
}
