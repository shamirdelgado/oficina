import { useRef } from 'react'
import type { ComponentProps } from 'react'
import { Html } from '@react-three/drei'

export function SceneLabel(props: ComponentProps<typeof Html>) {
  const portal = useRef(document.getElementById('scene-labels')!)
  return <Html portal={portal} {...props} />
}
