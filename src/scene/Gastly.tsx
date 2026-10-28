import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { NearestFilter, SRGBColorSpace, Sprite, TextureLoader } from 'three'
import type { Texture } from 'three'
import { useReducedMotion } from '../state/motion'

export function Gastly() {
  const sprite = useRef<Sprite>(null)
  const [frames, setFrames] = useState<Texture[]>([])
  const reduced = useReducedMotion()
  useEffect(() => {
    let disposed = false
    const loader = new TextureLoader()
    const textures: Texture[] = []
    Promise.all([1, 2, 3, 4].map(index => new Promise<Texture>((resolve, reject) => {
      textures.push(loader.load(`${import.meta.env.BASE_URL}img/sprites/gastly${index}.png`, texture => {
        texture.colorSpace = SRGBColorSpace
        texture.magFilter = NearestFilter
        texture.minFilter = NearestFilter
        texture.generateMipmaps = false
        resolve(texture)
      }, undefined, reject))
    }))).then(loaded => { if (!disposed) setFrames(loaded) }).catch(() => {})
    return () => { disposed = true; textures.forEach(texture => texture.dispose()) }
  }, [])

  useFrame(({ clock }) => {
    if (!sprite.current || !frames.length) return
    const time = reduced ? 0 : clock.elapsedTime
    sprite.current.position.y = 2.55 + Math.sin(time * 1.3) * 0.13
    const frame = frames[Math.floor(time * 5) % frames.length]
    if (sprite.current.material.map !== frame) sprite.current.material.map = frame
    // Cada fotograma conserva la escala del píxel y su proporción original.
    const source = frame.image as HTMLImageElement
    sprite.current.scale.set(source.width / 192, source.height / 192, 1)
  })

  return <sprite ref={sprite} position={[-1.65, 2.55, -6.05]} scale={[1.1, 1.1, 1]} visible={frames.length > 0}>
    <spriteMaterial map={frames[0] ?? null} transparent depthWrite={false} toneMapped={false} />
  </sprite>
}
