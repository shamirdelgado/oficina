import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { CanvasTexture, LinearFilter, SRGBColorSpace } from 'three'
import { useLanguage } from '../i18n'
import { useReducedMotion } from '../state/motion'

const colors = ['#b899f4', '#8ce7ea', '#f2edf9', '#b0a3c3']

export function CodeScreen() {
  const { t } = useLanguage()
  const reduced = useReducedMotion()
  const [texture, setTexture] = useState<CanvasTexture | null>(null)
  const draw = useRef<((time: number) => void) | null>(null)
  const lastFrame = useRef(-1)

  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 384
    canvas.height = 224
    const context = canvas.getContext('2d')
    if (!context) return
    const screen = new CanvasTexture(canvas)
    screen.colorSpace = SRGBColorSpace
    screen.minFilter = LinearFilter
    screen.generateMipmaps = false
    draw.current = time => {
      context.fillStyle = '#0e0a17'
      context.fillRect(0, 0, 384, 224)
      context.save()
      context.beginPath()
      context.rect(0, 35, 384, 189)
      context.clip()
      context.font = '15px "JetBrains Mono", monospace'
      const offset = time * 10 % (t.terminal.lines.length * 24)
      for (let index = 0; index < t.terminal.lines.length * 2; index++) {
        const y = 55 + index * 24 - offset
        if (y < 20 || y > 244) continue
        context.fillStyle = colors[index % colors.length]
        context.fillText(t.terminal.lines[index % t.terminal.lines.length], 16, y)
      }
      context.restore()
      context.fillStyle = '#352a46'
      context.fillRect(0, 0, 384, 30)
      context.font = '14px "JetBrains Mono", monospace'
      context.fillStyle = '#8ce7ea'
      context.fillText(t.terminal.title, 14, 20)
      screen.needsUpdate = true
    }
    draw.current(0)
    lastFrame.current = -1
    setTexture(screen)
    return () => { draw.current = null; screen.dispose() }
  }, [t.terminal])

  useEffect(() => {
    if (reduced) draw.current?.(0)
    lastFrame.current = -1
  }, [reduced])

  useFrame(({ clock }) => {
    if (reduced) return
    // Ocho actualizaciones por segundo bastan para este detalle de escritorio.
    const frame = Math.floor(clock.elapsedTime * 8)
    if (frame === lastFrame.current) return
    lastFrame.current = frame
    draw.current?.(clock.elapsedTime)
  })

  return <mesh position={[0, 0, 0.055]}>
    <planeGeometry args={[1.04, 0.6]} />
    <meshBasicMaterial map={texture} color={texture ? '#ffffff' : '#0e0a17'} toneMapped={false} />
  </mesh>
}
