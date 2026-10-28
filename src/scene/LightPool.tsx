import { useMemo } from 'react'
import { Color } from 'three'
import { useTheme } from '../state/theme'

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const fragmentShader = `
  varying vec2 vUv;
  uniform vec3 tint;
  uniform float strength;
  void main() {
    float halo = 1.0 - smoothstep(0.0, 0.5, length(vUv - 0.5));
    gl_FragColor = vec4(tint, halo * halo * strength);
    #include <colorspace_fragment>
  }
`

// Luz horneada sobre el mueble, sin luces ni mapas de sombras adicionales.
export function LightPool({ position, size, color, intensity = 0.65 }: {
  position: [number, number, number]
  size: [number, number]
  color: string
  intensity?: number
}) {
  const { theme } = useTheme()
  const uniforms = useMemo(() => ({
    tint: { value: new Color(color) },
    strength: { value: intensity * (theme === 'night' ? 1 : 0.3) },
  }), [color, intensity, theme])

  return <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
    <planeGeometry args={size} />
    <shaderMaterial transparent depthWrite={false} toneMapped={false}
      uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} />
  </mesh>
}
