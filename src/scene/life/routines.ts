import type { SkinId } from '../Character'
import type { CatActivity } from '../skins/Chispitas'
import { nodes, path } from './navGraph'
import type { NodeId, Point } from './navGraph'

export type ActorId = 'esiel' | 'kalua' | 'shamir' | 'emma' | 'cleaner' | 'cat' | 'visitor' | 'pikachu'
export type Actor = {
  id: ActorId
  skin: SkinId
  activity: CatActivity
  activityStep: number
  node: NodeId
  home: NodeId
  position: Point
  route: NodeId[]
  angle: number
  timer: number
  phase: 'home' | 'out' | 'pause' | 'return'
  visible: boolean
  cue: string
  cueUntil: number
  steps: number
  jump: number
  fade: number
}

export const timing = {
  workers: [40, 90],
  shamir: [90, 150],
  sweep: [6, 12],
  catArrival: [30, 60],
  catRest: [12, 22],
  catStop: [2, 4],
  conversation: [6, 10],
} as const
export const speeds = { person: 1.05, cleaner: 0.55, cat: 0.85 }
const delay = (range: readonly [number, number]) => random(range[0], range[1])
export const random = (min: number, max: number) => min + Math.random() * (max - min)
const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)]

function create(id: ActorId, home: NodeId, timer: number): Actor {
  return {
    id,
    skin: id === 'cleaner' ? 'lia' : id === 'cat' ? 'chispitas' : id,
    activity: 'idle',
    activityStep: 0,
    node: home,
    home,
    position: [...nodes[home]],
    route: [],
    angle: -Math.PI / 2,
    timer,
    phase: 'home',
    visible: id !== 'cat' && id !== 'visitor' && id !== 'pikachu',
    cue: '',
    cueUntil: 0,
    steps: 0,
    jump: 0,
    fade: 1,
  }
}

export function createActors() {
  return [
    create('esiel', 'esiel', delay(timing.workers)),
    create('kalua', 'kalua', delay(timing.workers)),
    create('shamir', 'shamir', delay(timing.shamir)),
    create('emma', 'reception', Infinity),
    create('cleaner', 'west', 4),
    create('cat', 'breakDoor', delay(timing.catArrival)),
    create('visitor', 'entrance', Infinity),
    create('pikachu', 'entrance', Infinity),
  ]
}

export function go(actor: Actor, destination: NodeId) {
  actor.route = path(actor.node, destination)
}

export function routine(actor: Actor, actors: Actor[], time: number) {
  if (actor.route.length || actor.timer > 0 || actor.id === 'emma' || actor.id === 'visitor' || actor.id === 'pikachu') return

  if (actor.id === 'cat') {
    if (!actor.visible) {
      actor.node = pick(['breakDoor', 'esiel', 'reception'])
      actor.position = [...nodes[actor.node]]
      actor.visible = true
      actor.steps = 5
      actor.phase = 'out'
    }

    if (actor.phase === 'pause') {
      go(actor, 'breakDoor')
      actor.activity = 'idle'
      actor.phase = 'return'
      return
    }

    if (actor.phase === 'return') {
      actor.visible = false
      actor.timer = delay(timing.catArrival)
      actor.phase = 'home'
      return
    }

    if (actor.steps-- > 0) {
      const activities: CatActivity[] = ['stretch', 'groom', 'sleep', 'watch', 'rub']
      actor.activity = activities[actor.activityStep++ % activities.length]
      const visitor = actors.find(other => other.id === 'visitor')!
      const companionReady = visitor.visible && !visitor.route.length
      if ((actor.activity === 'watch' || actor.activity === 'rub') && !companionReady) actor.activity = 'groom'
      const destination = actor.activity === 'sleep' ? 'sofa'
        : actor.activity === 'watch' ? 'visitorSide'
        : actor.activity === 'rub' ? 'petPass'
        : pick(['coffee', 'breakBack', 'reception', 'esiel'] as const)
      go(actor, destination)
      actor.timer = actor.activity === 'sleep' ? random(24, 36) : actor.activity === 'rub' ? 8 : random(6, 10)
    } else {
      actor.phase = 'pause'
      actor.activity = pick(['stretch', 'groom'])
      actor.timer = delay(timing.catRest)
    }
    return
  }

  if (actor.id === 'cleaner') {
    go(actor, pick(['west', 'corridor', 'east', 'breakDoor', 'breakBack', 'reception']))
    actor.timer = delay(timing.sweep)
    actor.cue = 'sweep'
    actor.cueUntil = time + actor.timer
    return
  }

  if (actor.phase === 'home') {
    const coworkerAway = actors.some(other =>
      other.id !== actor.id && ['esiel', 'kalua'].includes(other.id) && other.phase !== 'home',
    )
    if (actor.id !== 'shamir' && coworkerAway) {
      actor.timer = 8
      return
    }

    const other = actor.id === 'esiel' ? 'kalua' : actor.id === 'kalua' ? 'esiel' : pick(['esiel', 'kalua'] as const)
    const destinations: NodeId[] = actor.id === 'shamir'
      ? [
          'coffee',
          ...actors
            .filter(person => ['esiel', 'kalua'].includes(person.id) && person.phase === 'home')
            .map(person => person.home),
        ]
      : ['coffee', other]
    go(actor, pick(destinations))
    actor.phase = 'out'
    return
  }

  if (actor.phase === 'out') {
    actor.phase = 'pause'
    actor.timer = delay(timing.conversation)
    actor.cue = actor.node === 'coffee' ? 'coffee' : 'talk'
    actor.cueUntil = time + actor.timer
    const partner = actors.find(other => other.id === actor.node && other !== actor)
    if (partner && !partner.route.length) {
      actor.angle = Math.atan2(partner.position[0] - actor.position[0], partner.position[2] - actor.position[2])
      partner.angle = actor.angle + Math.PI
      partner.timer = Math.max(partner.timer, actor.timer + 2)
      partner.cue = 'talk'
      partner.cueUntil = actor.cueUntil
    }
    return
  }

  if (actor.phase === 'pause') {
    go(actor, actor.home)
    actor.phase = 'return'
    return
  }

  actor.phase = 'home'
  actor.angle = -Math.PI / 2
  actor.timer = actor.id === 'shamir' ? delay(timing.shamir) : delay(timing.workers)
}
