import { useLayoutEffect, useRef } from 'react'
import { Color, InstancedMesh, Matrix4 } from 'three'
import { useOfficePalette } from './palette'

export function Floor() {
  const boards = useRef<InstancedMesh>(null)
  const palette = useOfficePalette()
  useLayoutEffect(() => {
    if (!boards.current) return
    const matrix = new Matrix4()
    const color = new Color()
    for (let row = 0; row < 8; row++) {
      for (let column = 0; column < 17; column++) {
        const index = row * 17 + column
        matrix.makeTranslation(-6.5 + column, 0.025, -7 + row * 2)
        boards.current.setMatrixAt(index, matrix)
        boards.current.setColorAt(index, color.set(palette.boards[(column * 3 + row) % 4]))
      }
    }
    boards.current.instanceMatrix.needsUpdate = true
    if (boards.current.instanceColor) boards.current.instanceColor.needsUpdate = true
  }, [palette])
  return <instancedMesh ref={boards} args={[undefined, undefined, 136]} receiveShadow>
    <boxGeometry args={[0.985, 0.015, 1.985]} />
    <meshStandardMaterial roughness={0.94} />
  </instancedMesh>
}
