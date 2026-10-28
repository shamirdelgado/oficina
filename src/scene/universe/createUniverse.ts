import {
  BufferAttribute, BufferGeometry, Group, LineBasicMaterial, LineSegments, MathUtils,
  PerspectiveCamera, Points, PointsMaterial, Scene, ShaderMaterial, Texture, TextureLoader,
  Vector2, Vector3,
} from 'three'
import { fragmentShader, vertexShader } from './shaders'

interface Atlas {
  celda: number
  columnas: number
  numeros: number[]
}
interface Constellation {
  estrellas: [number, number][]
  lineas: [number, number][]
}
interface Frame {
  width: number
  height: number
  pixel: number
  delta: number
  reduced: boolean
  day: boolean
  quality: boolean
  coarse: boolean
}

const generation = 1 + Math.floor(Math.random() * 9)
const asset = (name: string) => `${import.meta.env.BASE_URL}img/universo/${name}`

export function createUniverse() {
  const scene = new Scene()
  const camera = new PerspectiveCamera(35, 1, 0.1, 6000)
  camera.position.z = 1500
  const abort = new AbortController()
  const total = 950
  const positions = new Float32Array(total * 3)
  const random = new Float32Array(total * 4)
  const cells = new Float32Array(total * 4)
  let seed = 149
  const next = () => {
    seed = (1664525 * seed + 1013904223) >>> 0
    return seed / 4294967296
  }
  for (let i = 0; i < total; i++) {
    positions.set([(next() * 2 - 1) * 1.15, (next() * 2 - 1) * 1.15, -(3 - i % 4) * 260], i * 3)
    random.set([next(), next(), (i % 4 + next()) / 4, next()], i * 4)
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  geometry.setAttribute('aAzar', new BufferAttribute(random, 4))
  geometry.setAttribute('aCelda', new BufferAttribute(cells, 4))
  const uniforms = {
    uTiempo: { value: 0 }, uOndaTiempo: { value: -10 }, uPixel: { value: 1 },
    uReducido: { value: 0 }, uDia: { value: 0 }, uActivo: { value: 0 },
    uVista: { value: new Vector2(1, 1) }, uPuntero: { value: new Vector2() },
    uAtlas: { value: new Texture() },
  }
  const emptyTexture = uniforms.uAtlas.value
  const material = new ShaderMaterial({
    vertexShader, fragmentShader, uniforms, transparent: true, depthWrite: false,
  })
  const cloud = new Points(geometry, material)
  cloud.frustumCulled = false
  cloud.visible = false
  scene.add(cloud)
  const constellations: {
    group: Group
    stars: Points<BufferGeometry, PointsMaterial>
    lines: LineSegments<BufferGeometry, LineBasicMaterial>
  }[] = []
  let atlasTexture: Texture | undefined
  let time = 0
  let lastWave = -10
  const lastPointer = new Vector2(9, 9)
  const pointer = new Vector2()
  let active = false
  let previousDay: boolean | undefined

  async function readJson<T>(name: string): Promise<T> {
    const response = await fetch(asset(name), { signal: abort.signal })
    if (!response.ok) throw new Error(name)
    return response.json() as Promise<T>
  }

  void readJson<Atlas>(`gen${generation}.json`).then(async atlas => {
    const texture = await new TextureLoader().loadAsync(asset(`gen${generation}.png`))
    if (abort.signal.aborted) { texture.dispose(); return }
    atlasTexture = texture
    const image = texture.image as HTMLImageElement
    for (let i = 0; i < total; i++) {
      const cell = i % atlas.numeros.length
      cells.set([
        (cell % atlas.columnas) * atlas.celda / image.width,
        1 - (Math.floor(cell / atlas.columnas) + 1) * atlas.celda / image.height,
        atlas.celda / image.width, atlas.celda / image.height,
      ], i * 4)
    }
    uniforms.uAtlas.value = texture
    geometry.attributes.aCelda.needsUpdate = true
    cloud.visible = true
  }).catch(() => { /* El fondo conserva sus constelaciones si falta el atlas. */ })

  void readJson<Record<string, Constellation[]>>('constelaciones.json').then(data => {
    if (abort.signal.aborted) return
    for (const drawing of data[generation] ?? []) {
      const points = drawing.estrellas.map(([x, y]) => new Vector3(x - 0.5, 0.5 - y, 0))
      const stars = new Points(new BufferGeometry().setFromPoints(points), new PointsMaterial({
        size: 2.5, sizeAttenuation: false, transparent: true, opacity: 0.5, depthWrite: false,
      }))
      const segments = drawing.lineas.flatMap(([a, b]) => points[a] && points[b] ? [points[a], points[b]] : [])
      const lines = new LineSegments(new BufferGeometry().setFromPoints(segments), new LineBasicMaterial({
        transparent: true, opacity: 0.14, depthWrite: false,
      }))
      const group = new Group()
      group.add(stars, lines)
      scene.add(group)
      constellations.push({ group, stars, lines })
    }
    previousDay = undefined
  }).catch(() => { /* Las siluetas funcionan también sin constelaciones. */ })

  return {
    scene,
    camera,
    point(x: number, y: number) { pointer.set(x, y); active = true },
    release() { active = false },
    update({ width, height, pixel, delta, reduced, day, quality, coarse }: Frame) {
      if (uniforms.uVista.value.x !== width || uniforms.uVista.value.y !== height) {
        camera.aspect = width / height
        camera.fov = MathUtils.radToDeg(2 * Math.atan(height / 3000))
        camera.updateProjectionMatrix()
        uniforms.uVista.value.set(width, height)
      }
      if (!reduced) time += Math.min(delta, 0.04)
      const elapsed = reduced ? 0 : time
      uniforms.uTiempo.value = elapsed
      uniforms.uReducido.value = reduced ? 1 : 0
      uniforms.uDia.value = day ? 1 : 0
      uniforms.uPixel.value = pixel
      uniforms.uPuntero.value.copy(pointer)
      uniforms.uActivo.value = active && !reduced ? 1 : 0
      if (!reduced && active && time - lastWave > 0.14 && pointer.distanceTo(lastPointer) > 0.035) {
        uniforms.uOndaTiempo.value = time
        lastWave = time
        lastPointer.copy(pointer)
      }
      const mobile = width < 760
      const count = mobile ? 230 : coarse ? 475 : total
      geometry.setDrawRange(0, Math.round(count * (quality ? 1 : 0.55)))
      constellations.forEach(({ group, stars, lines }, i) => {
        group.scale.setScalar(Math.min(width, height) * (0.5 + i % 2 * 0.18) * (3700 / 1500))
        group.position.set(
          (i % 2 ? 1 : -1) * width * 0.22 * (3700 / 1500),
          (mobile ? (i % 2 ? -0.37 : 0.34) + Math.sin(elapsed * 0.006 + i * 2.4) * 0.025
            : Math.sin(elapsed * 0.006 + i * 2.4) * 0.28) * height * (3700 / 1500), -2200,
        )
        const presence = 0.35 + 0.65 * (0.5 + 0.5 * Math.cos(i * 2))
        stars.material.opacity = presence * (reduced ? 0.55 : 0.45 + 0.15 * Math.sin(elapsed * 0.7 + i)) * (mobile ? 1.2 : 1)
        lines.material.opacity = presence * (mobile ? 0.25 : 0.18)
        if (previousDay !== day) {
          stars.material.color.set(day ? '#543078' : '#c4b5e6')
          lines.material.color.copy(stars.material.color)
        }
      })
      previousDay = day
    },
    dispose() {
      abort.abort()
      geometry.dispose()
      material.dispose()
      emptyTexture.dispose()
      atlasTexture?.dispose()
      constellations.forEach(({ stars, lines }) => {
        stars.geometry.dispose(); stars.material.dispose()
        lines.geometry.dispose(); lines.material.dispose()
      })
      scene.clear()
    },
  }
}
