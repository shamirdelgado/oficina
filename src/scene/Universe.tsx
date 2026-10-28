import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useReducedMotion } from '../state/motion'
import { useTheme } from '../state/theme'
import { createUniverse } from './universe/createUniverse'

export function Universe({ quality }: { quality: boolean }) {
  const { gl } = useThree()
  const { theme } = useTheme()
  const reduced = useReducedMotion()
  const universe = useRef<ReturnType<typeof createUniverse> | null>(null)
  const coarse = useRef(false)

  useEffect(() => {
    const background = createUniverse()
    universe.current = background
    const preference = matchMedia('(pointer: coarse)')
    const updatePointer = () => { coarse.current = preference.matches }
    updatePointer()
    const point = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' && !event.buttons && event.type !== 'pointerdown') return
      const rect = gl.domElement.getBoundingClientRect()
      background.point((event.clientX - rect.left) / rect.width * 2 - 1, 1 - (event.clientY - rect.top) / rect.height * 2)
    }
    const release = () => background.release()
    const up = (event: PointerEvent) => { if (event.pointerType !== 'mouse') release() }
    const canvas = gl.domElement
    canvas.addEventListener('pointermove', point, { passive: true })
    canvas.addEventListener('pointerdown', point, { passive: true })
    canvas.addEventListener('pointerleave', release)
    canvas.addEventListener('pointercancel', release)
    window.addEventListener('pointerup', up)
    window.addEventListener('blur', release)
    preference.addEventListener('change', updatePointer)
    return () => {
      canvas.removeEventListener('pointermove', point)
      canvas.removeEventListener('pointerdown', point)
      canvas.removeEventListener('pointerleave', release)
      canvas.removeEventListener('pointercancel', release)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('blur', release)
      preference.removeEventListener('change', updatePointer)
      universe.current = null
      background.dispose()
    }
  }, [gl])

  // Una sola superficie: el fondo usa su cámara y la oficina conserva la suya.
  useFrame(({ gl: renderer, scene, camera, size }, delta) => {
    const background = universe.current
    const autoClear = renderer.autoClear
    renderer.autoClear = false
    renderer.clear()
    if (background) {
      background.update({
        width: size.width, height: size.height, pixel: renderer.getPixelRatio(), delta,
        reduced, day: theme === 'day', quality, coarse: coarse.current,
      })
      renderer.render(background.scene, background.camera)
      renderer.clearDepth()
    }
    renderer.render(scene, camera)
    renderer.autoClear = autoClear
  }, 1)

  return null
}
