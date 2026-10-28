import { Group, Mesh, MeshStandardMaterial } from 'three'
import { Box, palette } from './primitives'

export function PersonVisual({ color }: { color: string }) {
  return <group>
    <mesh castShadow position={[0, 1.1, 0]}><capsuleGeometry args={[0.28, 0.55, 3, 8]} /><meshStandardMaterial color={color} flatShading /></mesh>
    <mesh castShadow position={[0, 1.75, 0]}><capsuleGeometry args={[0.23, 0.06, 3, 8]} /><meshStandardMaterial color="#d4a17f" flatShading /></mesh>
    <group name="gesture" position={[0.35, 1.35, 0]}><Box size={[0.12, 0.6, 0.14]} position={[0, -0.2, 0]} color={color} /></group>
    <group name="standing">{[-0.18, 0.18].map(x => <Box key={x} position={[x, 0.35, 0]} size={[0.22, 0.7, 0.25]} color={palette.ink} />)}</group>
    <group name="seated" visible={false}>{[-0.18, 0.18].map(x => <group key={x}>
      <Box position={[x, 0.7, 0.2]} size={[0.22, 0.22, 0.7]} color={palette.ink} />
      <Box position={[x, 0.4, 0.45]} size={[0.22, 0.6, 0.22]} color={palette.ink} />
    </group>)}</group>
  </group>
}
export function CatVisual() {
  return <group>
    <Box size={[0.4, 0.35, 0.75]} position={[0, 0.3, 0]} color="#ca9870" />
    <Box size={[0.4, 0.38, 0.35]} position={[0, 0.57, 0.32]} color="#ca9870" />
    {[-0.14, 0.14].map(x => <mesh key={x} position={[x, 0.84, 0.32]}><coneGeometry args={[0.12, 0.25, 3]} /><meshStandardMaterial color="#9f7056" /></mesh>)}
    <Box size={[0.1, 0.65, 0.1]} position={[0, 0.6, -0.4]} rotation={[-0.35, 0, 0]} color="#ca9870" />
  </group>
}
export function Broom() {
  return <group position={[0.46, 0.65, 0.35]} rotation={[0.3, 0, -0.3]}>
    <mesh><cylinderGeometry args={[0.035, 0.035, 1.5, 6]} /><meshStandardMaterial color={palette.wood} /></mesh>
    <Box size={[0.5, 0.18, 0.18]} position={[0, -0.75, 0]} color="#c7ad78" />
  </group>
}

export type VisualPose = {
  angle: number; walking: boolean; seated: boolean; greeting: boolean; sweeping: boolean;
  resting: boolean; jump: number; opacity: number; reduced: boolean; time: number
}
export function updateActorVisual(visual: Group, pose: VisualPose) {
  visual.rotation.y = pose.angle
  visual.position.y = pose.reduced ? 0 : pose.walking ? Math.sin(pose.time * 9) * 0.045
    : pose.jump > 0 ? Math.sin(pose.jump / 0.6 * Math.PI) * 0.4 : 0
  visual.scale.y = pose.resting ? 0.65 : 1
  visual.traverse(object => {
    if (object instanceof Mesh && object.material instanceof MeshStandardMaterial && (pose.reduced || object.material.transparent)) {
      object.material.transparent = pose.reduced
      object.material.opacity = pose.reduced ? Math.max(0, pose.opacity) : 1
    }
  })
  const legs = visual.getObjectByName('standing')
  const seatedLegs = visual.getObjectByName('seated')
  if (legs) legs.visible = !pose.seated
  if (seatedLegs) seatedLegs.visible = pose.seated
  const arm = visual.getObjectByName('gesture')
  if (arm) {
    arm.rotation.z = pose.greeting ? -2.3 + (pose.reduced ? 0 : Math.sin(pose.time * 8) * 0.3) : 0.15
    arm.rotation.x = pose.seated ? (pose.reduced ? 0 : Math.sin(pose.time * 4) * 0.09) - 0.5 : 0
  }
  const broom = visual.getObjectByName('broom')
  if (broom) broom.rotation.x = pose.sweeping && !pose.reduced ? Math.sin(pose.time * 6) * 0.35 : 0
}
