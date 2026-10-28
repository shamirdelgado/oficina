import { box, capsule, cone, Parts, sphere, torus } from './parts'

export type CatActivity = 'idle' | 'stretch' | 'groom' | 'sleep' | 'watch' | 'rub'
const grey = '#9aa0aa'
const white = '#f7f6f2'
const body = [
  sphere(grey, [0, 0.34, -0.04], [0.43, 0.4, 0.74]),
  sphere(white, [0, 0.34, 0.25], [0.3, 0.34, 0.2]),
  sphere(white, [0.15, 0.43, -0.16], [0.17, 0.2, 0.3]),
  ...[-0.14, 0.14].flatMap(x => [capsule(grey, [x, 0.18, -0.25], [0.23, 0.27, 0.28]), sphere(white, [x, 0.065, -0.19], [0.18, 0.13, 0.24])]),
]
const head = [
  sphere(grey, [0, 0, 0], [0.43, 0.38, 0.37]),
  ...[-1, 1].flatMap(side => [
    cone(grey, [side * 0.14, 0.2, -0.015], [0.2, 0.23, 0.17], [0, 0, -side * 0.12]),
    cone('#c6a8ac', [side * 0.14, 0.205, 0.06], [0.1, 0.13, 0.035]),
    sphere(white, [side * 0.065, -0.075, 0.17], [0.16, 0.12, 0.13]),
  ]),
  cone(white, [0, 0.055, 0.176], [0.1, 0.24, 0.045]),
  sphere('#b67e87', [0, -0.047, 0.233], [0.06, 0.04, 0.025]),
  torus('#d23a3a', [0, -0.13, -0.03], [0.37, 0.33, 0.12], [Math.PI / 2, 0, 0]),
  sphere('#d7dce2', [0, -0.2, 0.15], [0.075, 0.09, 0.035]),
]
const eyes = [-1, 1].flatMap(side => [
  sphere('#c8d24a', [side * 0.1, 0.025, 0.164], [0.085, 0.065, 0.035]),
  box('#272635', [side * 0.1, 0.025, 0.183], [0.017, 0.05, 0.012]),
])
const closedEyes = [-1, 1].map(side => box('#272635', [side * 0.1, 0.025, 0.172], [0.07, 0.015, 0.02]))
const paw = [capsule(grey, [0, -0.09, 0], [0.22, 0.25, 0.22]), sphere(white, [0, -0.2, 0.035], [0.17, 0.13, 0.23])]
const tail = [
  capsule(grey, [0, 0.1, -0.12], [0.32, 0.38, 0.32], [0.7, 0, 0]),
  capsule(grey, [0, 0.35, -0.29], [0.37, 0.4, 0.35], [0.5, 0, 0]),
  sphere(grey, [0, 0.55, -0.37], [0.23, 0.26, 0.23]),
]
const curledTail = [torus(grey, [0, 0.17, -0.05], [0.7, 0.7, 0.3], [Math.PI / 2, 0, 0])]

export function CatVisual() {
  return <group name="cat-body">
    <Parts parts={body} />
    <group name="cat-head" position={[0, 0.57, 0.31]}><Parts parts={head} /><group name="cat-eyes"><Parts parts={eyes} /></group><group name="cat-sleep-eyes" visible={false}><Parts parts={closedEyes} /></group></group>
    {[-1, 1].map(side => <group key={side} name={side < 0 ? 'cat-paw-left' : 'cat-paw-right'} position={[side * 0.14, 0.28, 0.25]}><Parts parts={paw} /></group>)}
    <group name="cat-tail" position={[0, 0.37, -0.36]}><Parts parts={tail} /></group>
    <group name="cat-curled-tail" visible={false}><Parts parts={curledTail} /></group>
  </group>
}
