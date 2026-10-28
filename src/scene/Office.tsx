import { BreakRoom } from './zones/BreakRoom'
import { Life } from './life/Life'
import { Box, palette } from './primitives'
import { Reception } from './zones/Reception'
import { Desks } from './zones/Desks'
import { BossOffice } from './zones/BossOffice'
import { WallArt } from './WallArt'

export function Office() {
  return <group>
    <Box size={[17.4, 0.3, 16.4]} position={[1.5, -0.18, 0]} color={palette.wood} />
    <Box size={[17, 0.08, 16]} position={[1.5, -0.02, 0]} color={palette.cream} />
    <Box size={[0.2, 3.6, 16.2]} position={[-7, 1.8, 0]} color="#e4d6c5" />
    <Box size={[14.2, 3.6, 0.2]} position={[0, 1.8, -8]} color="#eee1cd" />
    <Box size={[0.24, 0.14, 16.2]} position={[-6.98, 0.1, 0]} color={palette.wood} />
    <Box size={[14.2, 0.14, 0.24]} position={[0, 0.1, -7.98]} color={palette.wood} />
    <Reception />
    <Desks />
    <BossOffice />
    <BreakRoom />
    <WallArt />
    <Life />
  </group>
}
