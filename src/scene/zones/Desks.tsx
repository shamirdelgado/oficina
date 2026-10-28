import { Chair, Desk } from '../primitives'
import { ImageFrame } from '../ImageFrame'
import { useCameraFocus } from '../../state/camera'
import { projects } from '../../content/projects'

export function Desks() {
  const { focus } = useCameraFocus()
  return <group>
    {([-1.6, 2.7] as const).map(x => <group key={x} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
      <Desk position={[0, 0, 0]} code={x === -1.6} ball={x === -1.6 ? 'violet' : 'orange'} />
      <group rotation={[0, Math.PI, 0]}><Chair position={[0, 0, -1.3]} /></group>
    </group>)}
    {projects.map((project, index) =>
      <ImageFrame key={project.id} image={project.image} position={[-6.82, 2.25, 1.3 - index * 2.8]}
        rotation={Math.PI / 2} width={2.45} ratio={16 / 10} onClick={() => focus('projectsWall')} />)}
  </group>
}
