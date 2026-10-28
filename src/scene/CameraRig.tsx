import { useCallback, useEffect, useRef } from 'react'
import { MapControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { MathUtils, OrthographicCamera, Vector3 } from 'three'
import type { ComponentRef } from 'react'
import { actorPositions, cameraTargets, useCameraFocus } from '../state/camera'
import type { CameraTarget } from '../state/camera'
import { useReducedMotion } from '../state/motion'

const up = new Vector3(0, 1, 0)
const offset = new Vector3(19, 19, 19)
const right = new Vector3(offset.z, 0, -offset.x).normalize()
const vertical = new Vector3().crossVectors(offset.clone().normalize(), right).normalize()
const corners = [-7.3, 10.3].flatMap(x =>
  [-8.3, 8.3].flatMap(z => [0, 3.7].map(y => new Vector3(x, y, z))),
)
const projectedWidth = projectedSpan(right)
const projectedHeight = projectedSpan(vertical)

function projectedSpan(axis: Vector3) {
  const projections = corners.map(point => point.dot(axis))
  return Math.max(...projections) - Math.min(...projections)
}

type CameraTraceEntry = [
  time: number,
  target: CameraTarget,
  revision: number,
  zoom: number,
  desiredZoom: number,
  moving: boolean,
]

declare global {
  interface Window {
    __cameraTrace?: CameraTraceEntry[]
  }
}

export function CameraRig() {
  const { camera, size } = useThree()
  const { request, motion } = useCameraFocus()
  const reducedMotion = useReducedMotion()
  const controls = useRef<ComponentRef<typeof MapControls>>(null)
  const moving = useRef(true)
  const destination = useRef(new Vector3())
  const desiredZoom = useRef(1)
  const deltaVector = useRef(new Vector3())
  const portrait = size.height > size.width
  const availableHeight = Math.max(120, size.height - (size.width < 600 ? 185 : 200))
  const heightZoom = availableHeight / projectedHeight
  const availableWidth = size.width < 600 ? size.width * 1.1 : size.width - 48
  const fitZoom = Math.max(3, portrait ? heightZoom : Math.min(availableWidth / projectedWidth, heightZoom))

  useEffect(() => {
    const target = cameraTargets[request.target]
    destination.current.set(target.point[0], target.point[1], target.point[2])
    desiredZoom.current = fitZoom * target.scale
    moving.current = true
    motion.current = { ...request, moving: true }
  }, [request, fitZoom, motion])

  const clampPan = useCallback(() => {
    const control = controls.current
    if (!control || moving.current) return

    const target = control.target
    deltaVector.current.copy(target)
    target.set(
      MathUtils.clamp(target.x, portrait ? -10 : -6, portrait ? 12 : 6),
      MathUtils.clamp(target.y, 0, 3),
      MathUtils.clamp(target.z, portrait ? -10 : -7, portrait ? 10 : 6),
    )
    deltaVector.current.sub(target)
    camera.position.sub(deltaVector.current)
  }, [camera, portrait])

  useFrame((_, delta) => {
    const control = controls.current
    const actorKey = request.target === 'boss' ? 'shamir' : request.target
    const tracked = actorPositions[actorKey]
    if (tracked && ['esiel', 'kalua', 'shamir', 'cleaner', 'visitor'].includes(actorKey)) {
      destination.current.set(tracked[0], tracked[1] + 1, tracked[2])
      moving.current = true
    }

    if (control && moving.current && camera instanceof OrthographicCamera) {
      const alpha = reducedMotion ? 1 : 1 - Math.exp(-7 * Math.min(delta, 0.1))
      control.target.lerp(destination.current, alpha)
      camera.position.copy(control.target).add(offset)
      camera.up.copy(up)
      camera.zoom = MathUtils.lerp(camera.zoom, desiredZoom.current, alpha)
      camera.updateProjectionMatrix()
      control.update()

      const atDestination = control.target.distanceTo(destination.current) < 0.005
      const atZoom = Math.abs(camera.zoom - desiredZoom.current) < 0.01
      if (atDestination && atZoom) {
        control.target.copy(destination.current)
        camera.position.copy(control.target).add(offset)
        camera.zoom = desiredZoom.current
        camera.updateProjectionMatrix()
        control.update()
        moving.current = false
      }
    }

    motion.current.moving = moving.current

    if (import.meta.env.DEV) {
      const trace = window.__cameraTrace ??= []
      const previous = trace[trace.length - 1]
      if (
        !previous ||
        previous[1] !== request.target ||
        previous[2] !== request.revision ||
        previous[3] !== camera.zoom ||
        previous[4] !== desiredZoom.current ||
        previous[5] !== moving.current
      ) {
        trace.push([
          performance.now(),
          request.target,
          request.revision,
          camera.zoom,
          desiredZoom.current,
          moving.current,
        ])
        if (trace.length > 300) trace.shift()
      }
    }
  })

  return (
    <MapControls
      ref={controls}
      makeDefault
      enableRotate={false}
      screenSpacePanning={false}
      enableDamping={!reducedMotion}
      dampingFactor={0.12}
      minZoom={fitZoom * 0.85}
      maxZoom={fitZoom * 3}
      onStart={() => {
        moving.current = false
      }}
      onChange={clampPan}
    />
  )
}
