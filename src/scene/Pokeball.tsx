import { useOfficePalette } from './palette'

export type BallKind = 'poke' | 'orange' | 'violet' | 'ultra'
const tops: Record<BallKind, string> = {
  poke: '#cd5772', orange: '#f08a24', violet: '#5a46d6', ultra: '#26232c',
}

export function Pokeball({ position, kind = 'poke' }: { position: [number, number, number]; kind?: BallKind }) {
  const palette = useOfficePalette()
  return <group position={position} rotation={[0, 0.3, 0]}>
    <mesh castShadow>
      <sphereGeometry args={[0.17, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color={tops[kind]} roughness={0.45} flatShading />
    </mesh>
    {/* Franjas amarillas de la Ultra Ball, de polo a ecuador a cada lado */}
    {kind === 'ultra' && [Math.PI * 0.25, Math.PI * 1.25].map(start => <mesh key={start} castShadow>
      <sphereGeometry args={[0.174, 6, 6, start, Math.PI * 0.5, 0.18, Math.PI / 2 - 0.18]} />
      <meshStandardMaterial color="#f2c12e" roughness={0.45} flatShading />
    </mesh>)}
    <mesh castShadow>
      <sphereGeometry args={[0.17, 12, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
      <meshStandardMaterial color="#eee5ee" roughness={0.45} flatShading />
    </mesh>
    <mesh>
      <cylinderGeometry args={[0.172, 0.172, 0.035, 12]} />
      <meshStandardMaterial color={palette.ink} />
    </mesh>
    <mesh position={[0, 0, 0.167]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.06, 0.06, 0.03, 12]} />
      <meshStandardMaterial color={palette.ink} />
    </mesh>
    <mesh position={[0, 0, 0.187]}>
      <circleGeometry args={[0.037, 12]} />
      <meshBasicMaterial color="#f2edf9" />
    </mesh>
  </group>
}
