import { createContext, useContext, useEffect, useMemo } from 'react'
import type { ReactNode } from 'react'
import { BoxGeometry, CapsuleGeometry, CylinderGeometry, Euler, Matrix4, MeshStandardMaterial, Quaternion, SphereGeometry, TorusGeometry, Vector3 } from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import type { BufferGeometry } from 'three'

type Triple = [number, number, number]
export type Part = { kind: 'box' | 'sphere' | 'capsule' | 'cone' | 'torus'; color: string; position: Triple; size: Triple; rotation?: Triple }
export const box = (color: string, position: Triple, size: Triple, rotation?: Triple): Part => ({ kind: 'box', color, position, size, rotation })
export const sphere = (color: string, position: Triple, size: Triple, rotation?: Triple): Part => ({ kind: 'sphere', color, position, size, rotation })
export const capsule = (color: string, position: Triple, size: Triple, rotation?: Triple): Part => ({ kind: 'capsule', color, position, size, rotation })
export const cone = (color: string, position: Triple, size: Triple, rotation?: Triple): Part => ({ kind: 'cone', color, position, size, rotation })
export const torus = (color: string, position: Triple, size: Triple, rotation?: Triple): Part => ({ kind: 'torus', color, position, size, rotation })
const Materials = createContext<Map<string, MeshStandardMaterial> | null>(null)

export function ActorMaterials({ children }: { children: ReactNode }) {
  // Cada actor conserva su fundido, compartiendo colores entre sus articulaciones.
  const materials = useMemo(() => new Map<string, MeshStandardMaterial>(), [])
  useEffect(() => () => materials.forEach(material => material.dispose()), [materials])
  return <Materials.Provider value={materials}>{children}</Materials.Provider>
}

function geometry(part: Part): BufferGeometry {
  const raw = part.kind === 'box' ? new BoxGeometry(1, 1, 1)
    : part.kind === 'sphere' ? new SphereGeometry(0.5, 8, 6)
    : part.kind === 'capsule' ? new CapsuleGeometry(0.25, 0.5, 2, 8)
    : part.kind === 'cone' ? new CylinderGeometry(0.28, 0.5, 1, 8)
    : new TorusGeometry(0.34, 0.16, 5, 10)
  const result = raw.index ? raw.toNonIndexed() : raw
  if (result !== raw) raw.dispose()
  const rotation = new Quaternion().setFromEuler(new Euler(...(part.rotation ?? [0, 0, 0])))
  result.applyMatrix4(new Matrix4().compose(new Vector3(...part.position), rotation, new Vector3(...part.size)))
  return result
}

export function Parts({ parts }: { parts: Part[] }) {
  const materials = useContext(Materials)!
  const batches = useMemo(() => {
    const colors = new Map<string, BufferGeometry[]>()
    for (const part of parts) {
      const pieces = colors.get(part.color) ?? []
      pieces.push(geometry(part))
      colors.set(part.color, pieces)
    }
    return [...colors].map(([color, pieces]) => {
      if (!materials.has(color)) materials.set(color, new MeshStandardMaterial({ color, flatShading: true, roughness: 0.85 }))
      const merged = mergeGeometries(pieces)!
      pieces.forEach(piece => piece.dispose())
      return { color, geometry: merged, material: materials.get(color)! }
    })
  }, [parts, materials])
  useEffect(() => () => batches.forEach(batch => batch.geometry.dispose()), [batches])
  return <>{batches.map(batch => <mesh key={batch.color} geometry={batch.geometry} material={batch.material} castShadow receiveShadow dispose={null} />)}</>
}
