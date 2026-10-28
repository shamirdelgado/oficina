import { useEffect, useState } from 'react'
import { SRGBColorSpace, TextureLoader } from 'three'
import type { Texture } from 'three'
import { Box } from './primitives'
import { useOfficePalette } from './palette'

export function ImageFrame({ image, position, width, ratio, rotation = 0, onClick }: {
  image?: string; position: [number, number, number]; width: number; ratio: number; rotation?: number; onClick?: () => void
}) {
  const palette = useOfficePalette()
  const [texture, setTexture] = useState<Texture | null>(null)
  useEffect(() => {
    setTexture(null)
    if (!image) return
    let disposed = false
    const pending = new TextureLoader().load(image, result => {
      if (disposed) { result.dispose(); return }
      result.colorSpace = SRGBColorSpace
      setTexture(result)
    }, undefined, () => { if (!disposed) setTexture(null) })
    return () => { disposed = true; pending.dispose() }
  }, [image])
  const height = width / ratio
  const border = Math.min(0.075, width * 0.1)
  const depth = Math.min(0.1, width * 0.16)
  return <group position={position} rotation={[0, rotation, 0]}
    onClick={onClick ? event => { event.stopPropagation(); onClick() } : undefined}>
    <Box size={[width + border * 2, height + border * 2, depth]} color={palette.wood} />
    <mesh position={[0, 0, depth / 2 + 0.01]}>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial color={texture ? '#ffffff' : palette.mat} map={texture} roughness={0.95} />
    </mesh>
  </group>
}
