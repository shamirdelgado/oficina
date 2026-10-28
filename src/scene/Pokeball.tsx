import { useOfficePalette } from './palette'

export function Pokeball({ position }: { position: [number, number, number] }) {
  const palette = useOfficePalette()
  return <group position={position} rotation={[0, 0.3, 0]}>
    <mesh castShadow>
      <sphereGeometry args={[0.17, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color="#cd5772" roughness={0.45} flatShading />
    </mesh>
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
