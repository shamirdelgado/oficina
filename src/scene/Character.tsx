import { Group, MathUtils, Mesh, MeshStandardMaterial } from 'three'
import { Box, palette } from './primitives'
import { Parts } from './skins/parts'
import { emma } from './skins/Emma'
import { esiel } from './skins/Esiel'
import { kalua } from './skins/Kalua'
import { shamir } from './skins/Shamir'
import { lia } from './skins/Lia'
import { visitor } from './skins/Visitor'
import type { PersonSkin } from './skins/person'
import type { CatActivity } from './skins/Chispitas'
export { CatVisual } from './skins/Chispitas'
export { PikachuVisual } from './skins/Pikachu'
export { ActorMaterials } from './skins/parts'
export type SkinId = PersonSkin | 'chispitas' | 'pikachu'

const skins = { emma, esiel, kalua, shamir, lia, visitor }
export function PersonVisual({ skin }: { skin: PersonSkin }) {
  const pieces = skins[skin]
  return <group>
    <Parts parts={pieces.body} />
    {[-1, 1].map(side => <group key={side} name={side > 0 ? 'gesture' : 'gesture-left'} position={[side * 0.35, 1.38, 0]}><Parts parts={pieces.arm} /></group>)}
    <group name="standing"><Parts parts={pieces.standing} /></group>
    <group name="seated" visible={false}><Parts parts={pieces.seated} /></group>
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
  activity: CatActivity; jump: number; opacity: number; reduced: boolean; time: number; dt: number
}
export function updateActorVisual(visual: Group, pose: VisualPose) {
  const pika = visual.getObjectByName('pika-body')
  const bounce = pose.walking ? (pika ? Math.abs(Math.sin(pose.time * 11)) * 0.075 : Math.sin(pose.time * 9) * 0.045) : 0
  visual.rotation.y = pose.angle
  visual.position.y = pose.reduced ? 0 : pose.jump > 0 ? Math.sin(pose.jump / 0.6 * Math.PI) * 0.4 : bounce
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
  for (const name of ['gesture', 'gesture-left']) {
    const arm = visual.getObjectByName(name)
    if (!arm) continue
    const side = name === 'gesture' ? 1 : -1
    arm.rotation.z = pose.greeting && side === 1 ? -2.3 + (pose.reduced ? 0 : Math.sin(pose.time * 8) * 0.3) : side * 0.15
    arm.rotation.x = pose.seated ? (pose.reduced ? 0 : Math.sin(pose.time * 4 + side) * 0.09) - 0.5 : 0
  }
  const broom = visual.getObjectByName('broom')
  if (broom) broom.rotation.x = pose.sweeping && !pose.reduced ? Math.sin(pose.time * 6) * 0.35 : 0
  if (pika) {
    const idle = !pose.walking
    pika.scale.y = idle ? 0.9 : 1
    const head = visual.getObjectByName('pika-head')!
    head.rotation.y = idle && !pose.reduced ? Math.sin(pose.time * 0.65) * Math.max(0, Math.sin(pose.time * 0.23)) * 0.45 : 0
    for (const [name, side] of [['pika-ear-left', -1], ['pika-ear-right', 1]] as const) {
      const ear = visual.getObjectByName(name)!
      ear.rotation.z = -side * 0.25 + (pose.reduced ? 0 : Math.sin(pose.time * 5 + side) * (pose.walking || Math.sin(pose.time * 0.8) > 0.9 ? 0.18 : 0.025))
    }
  }
  updateCat(visual, pose)
}

function updateCat(visual: Group, pose: VisualPose) {
  const body = visual.getObjectByName('cat-body')
  if (!body) return
  const activity = pose.walking ? 'idle' : pose.activity
  const stretch = activity === 'stretch'
  const sleep = activity === 'sleep'
  const groom = activity === 'groom'
  const watch = activity === 'watch'
  const alpha = pose.reduced ? 1 : 1 - Math.exp(-6 * pose.dt)
  const move = (value: number, target: number) => MathUtils.lerp(value, target, alpha)
  body.rotation.x = move(body.rotation.x, watch || groom ? -0.35 : 0)
  body.rotation.z = move(body.rotation.z, stretch ? Math.PI / 2 : activity === 'rub' ? 0.2 : 0)
  body.position.y = move(body.position.y, stretch ? 0.22 : sleep ? -0.02 : 0)
  body.scale.z = move(body.scale.z, stretch ? 1.35 : sleep || watch || groom ? 0.75 : 1)
  body.scale.y = move(body.scale.y, sleep ? 0.78 : 1)
  const head = visual.getObjectByName('cat-head')!
  head.position.y = move(head.position.y, sleep ? 0.35 : watch || groom ? 0.64 : 0.57)
  head.position.z = move(head.position.z, sleep ? 0.16 : 0.31)
  head.rotation.y = move(head.rotation.y, sleep ? 0.95 : 0)
  head.rotation.x = move(head.rotation.x, watch ? -0.65 : groom ? 0.4 + (pose.reduced ? 0 : Math.sin(pose.time * 5) * 0.12) : 0)
  for (const [name, side] of [['cat-paw-left', -1], ['cat-paw-right', 1]] as const) {
    const paw = visual.getObjectByName(name)!
    paw.rotation.x = move(paw.rotation.x, stretch ? -1.5 : groom && side === -1 ? -2.1 : sleep ? -0.8 : 0)
    paw.position.y = move(paw.position.y, groom && side === -1 ? 0.38 : 0.28)
  }
  visual.getObjectByName('cat-eyes')!.visible = !sleep
  visual.getObjectByName('cat-sleep-eyes')!.visible = sleep
  const tail = visual.getObjectByName('cat-tail')!
  tail.visible = !sleep
  tail.rotation.z = pose.reduced ? 0 : Math.sin(pose.time * 1.2) * 0.22
  tail.rotation.x = move(tail.rotation.x, stretch ? -0.65 : 0)
  const curled = visual.getObjectByName('cat-curled-tail')!
  curled.visible = sleep
  curled.rotation.y = pose.reduced ? 0 : Math.sin(pose.time * 0.65) * 0.045
}
