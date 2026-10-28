import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { NearestFilter, SRGBColorSpace, TextureLoader } from 'three'
import type { Group, Sprite, Texture } from 'three'
import { useLanguage } from '../i18n'
import { useReducedMotion } from '../state/motion'
import { hiddenByLobby } from '../state/lobby'
import { PetLabel, showBubble } from './pets/PetLabel'

// Lugares donde puede aparecer, repartidos por toda la oficina.
const anchors: [number, number, number][] = [
  [-4.6, 2.2, 5.6], [3.6, 2.4, 6.4], [-5.2, 2.5, 0.6], [0.6, 2.6, -1.6], [4.8, 2.3, 0.9],
  [8.2, 2.2, -0.4], [9.2, 2.6, 1.8], [-3.8, 2.4, -5.4], [-0.4, 2.7, -6.9], [5.7, 2.6, -4.6],
  [-2.6, 2.3, 2.0], [1.4, 2.5, 4.2],
]
const fade = 0.6

let audio: AudioContext | null = null
function unlockAudio() {
  if (!audio) audio = new AudioContext()
  if (audio.state === 'suspended') audio.resume().catch(() => {})
}

// Risita fantasmal sintetizada: tres "je" que bajan de tono con temblor.
function laugh() {
  if (!audio || audio.state !== 'running') return
  const start = audio.currentTime + 0.02
  for (let index = 0; index < 3; index++) {
    const at = start + index * 0.17
    const voice = audio.createOscillator()
    const wobble = audio.createOscillator()
    const depth = audio.createGain()
    const gain = audio.createGain()
    voice.type = 'triangle'
    voice.frequency.setValueAtTime(640 - index * 70, at)
    voice.frequency.exponentialRampToValueAtTime(420 - index * 50, at + 0.13)
    wobble.frequency.value = 28
    depth.gain.value = 22
    wobble.connect(depth).connect(voice.frequency)
    gain.gain.setValueAtTime(0.0001, at)
    gain.gain.exponentialRampToValueAtTime(0.07, at + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.14)
    voice.connect(gain).connect(audio.destination)
    voice.start(at)
    wobble.start(at)
    voice.stop(at + 0.15)
    wobble.stop(at + 0.15)
  }
}

export function Gastly() {
  const group = useRef<Group>(null)
  const sprite = useRef<Sprite>(null)
  const bubble = useRef<HTMLSpanElement>(null)
  const [frames, setFrames] = useState<Texture[]>([])
  const [hover, setHover] = useState(false)
  const reduced = useReducedMotion()
  const { t } = useLanguage()
  const state = useRef({ time: 0, anchor: 0, visibleFor: 0, hiddenFor: 3, shown: false, opacity: 0, laughUntil: 0 })

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
    // El navegador solo deja sonar audio después de un toque o clic.
    document.addEventListener('pointerdown', unlockAudio, { once: true })
    return () => {
      disposed = true
      textures.forEach(texture => texture.dispose())
      document.removeEventListener('pointerdown', unlockAudio)
    }
  }, [])

  const giggle = () => {
    const s = state.current
    if (!s.shown || s.laughUntil > s.time) return
    s.laughUntil = s.time + 2
    s.visibleFor = Math.max(s.visibleFor, 2.4)
    laugh()
  }

  useFrame((_, elapsed) => {
    if (document.hidden || !group.current || !sprite.current || !frames.length) return
    const s = state.current
    const dt = Math.min(elapsed, 0.08)
    s.time += dt

    if (s.shown) {
      s.visibleFor -= dt
      if (s.visibleFor <= 0) {
        s.shown = false
        s.hiddenFor = 5 + Math.random() * 9
      }
    } else {
      s.hiddenFor -= dt
      if (s.hiddenFor <= 0 && s.opacity <= 0) {
        // Reaparece en otro sitio, sin recorrer el camino.
        let next = Math.floor(Math.random() * anchors.length)
        if (next === s.anchor) next = (next + 1) % anchors.length
        s.anchor = next
        s.shown = true
        s.visibleFor = 7 + Math.random() * 7
      }
    }
    s.opacity = Math.min(1, Math.max(0, s.opacity + (s.shown ? dt : -dt) / (reduced ? 0.01 : fade)))

    const [x, y, z] = anchors[s.anchor]
    const laughing = s.laughUntil > s.time
    const shake = laughing && !reduced ? Math.sin(s.time * 40) * 0.05 : 0
    group.current.position.set(x + shake, y + (reduced ? 0 : Math.sin(s.time * 1.3) * 0.13), z)
    group.current.visible = s.opacity > 0.01 && !hiddenByLobby(z)
    sprite.current.material.opacity = s.opacity
    const frame = frames[Math.floor((reduced ? 0 : s.time) * (laughing ? 12 : 5)) % frames.length]
    if (sprite.current.material.map !== frame) sprite.current.material.map = frame
    const source = frame.image as HTMLImageElement
    const pulse = laughing && !reduced ? 1 + Math.abs(Math.sin(s.time * 14)) * 0.12 : 1
    sprite.current.scale.set(source.width / 192 * pulse, source.height / 192 * pulse, 1)
    showBubble(bubble.current, t.petCries.gastly, s.laughUntil, s.time)
    // Sin Gastly a la vista, su etiqueta tampoco debe recibir toques.
    const wrapper = bubble.current?.parentElement
    if (wrapper) wrapper.style.display = group.current.visible ? '' : 'none'
  })

  return <group ref={group} visible={false}>
    <sprite
      ref={sprite}
      onPointerOver={event => {
        event.stopPropagation()
        if (!state.current.shown) return
        setHover(true)
        giggle()
      }}
      onPointerOut={() => setHover(false)}
      onClick={event => { event.stopPropagation(); unlockAudio(); giggle() }}
    >
      <spriteMaterial map={frames[0] ?? null} transparent opacity={0} depthWrite={false} toneMapped={false} />
    </sprite>
    <PetLabel ref={bubble} height={0.9} label={t.pets.gastly} visible={hover} onSelect={giggle} />
  </group>
}
