import { forwardRef } from 'react'
import { SceneLabel } from '../SceneLabel'

// Etiqueta y globo de las mascotas, con el mismo estilo que los personajes.
export const PetLabel = forwardRef<HTMLSpanElement, {
  height: number; label: string; visible: boolean; onSelect: () => void
}>(function PetLabel({ height, label, visible, onSelect }, bubble) {
  return <SceneLabel position={[0, height, 0]} center zIndexRange={[25, 0]}>
    <div>
      <button className={`character-label ${visible ? 'is-visible' : ''}`} onClick={onSelect}>{label}</button>
      <span className="ambient-bubble" ref={bubble} hidden />
    </div>
  </SceneLabel>
})

export function showBubble(bubble: HTMLSpanElement | null, text: string, until: number, now: number) {
  if (!bubble) return
  const visible = until > now
  if (bubble.hidden === !visible && (!visible || bubble.textContent === text)) return
  bubble.textContent = visible ? text : ''
  bubble.hidden = !visible
}
