import { BreakRoom } from './zones/BreakRoom'
import { Life } from './life/Life'
import { Box } from './primitives'
import { useOfficePalette } from './palette'
import { Floor } from './Floor'
import { Reception } from './zones/Reception'
import { Desks } from './zones/Desks'
import { BossOffice } from './zones/BossOffice'
import { WallArt } from './WallArt'
import { WaitingRoom } from './zones/WaitingRoom'
import { Gastly } from './Gastly'
import { Tyrunt } from './pets/Tyrunt'
import { Aquarium } from './pets/Aquarium'

export function Office() {
  const palette = useOfficePalette()
  return <group>
    <Box size={[17.4, 0.3, 16.4]} position={[1.5, -0.18, 0]} color={palette.wood} />
    <Box size={[17, 0.08, 16]} position={[1.5, -0.02, 0]} color={palette.floor} />
    <Floor />
    <Box size={[0.2, 3.6, 16.2]} position={[-7, 1.8, 0]} color={palette.wall} />
    <Box size={[14.2, 3.6, 0.2]} position={[0, 1.8, -8]} color={palette.wallBack} />
    <Box size={[0.24, 0.14, 16.2]} position={[-6.98, 0.1, 0]} color={palette.wood} />
    <Box size={[14.2, 0.14, 0.24]} position={[0, 0.1, -7.98]} color={palette.wood} />
    {/* Pared del rincón de la pecera */}
    <Box size={[3, 3.6, 0.2]} position={[8.6, 1.8, -8]} color={palette.wallBack} />
    <Box size={[3, 0.14, 0.24]} position={[8.6, 0.1, -7.98]} color={palette.wood} />
    <Reception />
    <WaitingRoom />
    <Desks />
    <BossOffice />
    <BreakRoom />
    <WallArt />
    <Life />
    <Tyrunt />
    <Aquarium />
    <Gastly />
  </group>
}
