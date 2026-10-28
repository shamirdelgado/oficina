import { createContext, useContext, useRef, useState } from 'react'
import type { ReactNode, RefObject } from 'react'

export const cameraTargets = {
  overview: { point: [1.2, 1.1, 0], scale: 1 },
  reception: { point: [0, 0.5, 4.6], scale: 1.65 },
  projectsWall: { point: [-5.4, 1.8, -0.2], scale: 1.85 },
  desks: { point: [0, 0.6, -0.2], scale: 1.6 },
  breakRoom: { point: [7.6, 0.7, -0.2], scale: 1.8 },
  cleaner: { point: [0, 1, 2], scale: 2 },
  visitor: { point: [0, 1, 6], scale: 1.7 },
  esiel: { point: [-2, 1, -0.7], scale: 2.1 },
  kalua: { point: [2.4, 1, -0.7], scale: 2.1 },
  boss: { point: [0.6, 1, -5.5], scale: 1.85 },
} as const
export const actorPositions: Partial<Record<string, [number, number, number]>> = {}
export type CameraTarget = keyof typeof cameraTargets
type CameraMotion = { target: CameraTarget; revision: number; moving: boolean }
const CameraContext = createContext<{
  request: { target: CameraTarget; revision: number }
  focus: (target: CameraTarget) => void
  motion: RefObject<CameraMotion>
} | null>(null)

export function CameraProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState({ target: 'overview' as CameraTarget, revision: 0 })
  const motion = useRef<CameraMotion>({ ...request, moving: true })
  const focus = (target: CameraTarget) => setRequest(previous => ({ target, revision: previous.revision + 1 }))
  return <CameraContext.Provider value={{ request, focus, motion }}>{children}</CameraContext.Provider>
}

export function useCameraFocus() {
  const context = useContext(CameraContext)
  if (!context) throw new Error('CameraProvider')
  return context
}
