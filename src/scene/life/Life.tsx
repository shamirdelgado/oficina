import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { useLanguage } from '../../i18n'
import { useCameraFocus, actorPositions } from '../../state/camera'
import { useReducedMotion } from '../../state/motion'
import { useVisitor, visitorArrived } from '../../state/visitor'
import { PersonVisual, CatVisual, Broom, updateActorVisual } from '../Character'
import { SceneLabel } from '../SceneLabel'
import { createActors, go, routine, speeds } from './routines'
import type { Actor, ActorId } from './routines'
import { nodes } from './navGraph'
import type { NodeId, Point } from './navGraph'

const colors = {
  esiel: '#7b8c79',
  kalua: '#c47d65',
  shamir: '#6b3fd4',
  emma: '#6b3fd4',
  cleaner: '#6c97a3',
  visitor: '#d6a83e',
  cat: '#ca9870',
}

function reachNode(actor: Actor, node: NodeId, position: Point) {
  actor.position = position
  actor.node = node
  actor.route.shift()
}

export function Life() {
  const actors = useRef(createActors())
  const groups = useRef(new Map<ActorId, Group>())
  const visuals = useRef(new Map<ActorId, Group>())
  const labels = useRef(new Map<ActorId, HTMLDivElement>())
  const bubbles = useRef(new Map<ActorId, HTMLSpanElement>())
  const time = useRef(0)
  const greetingDeadline = useRef<number | null>(null)
  const visitorStarted = useRef(false)
  const { t } = useLanguage()
  const { name, arrived } = useVisitor()
  const { request, focus, motion } = useCameraFocus()
  const focusRef = useRef(focus)
  focusRef.current = focus
  const reduced = useReducedMotion()
  const [hover, setHover] = useState<ActorId | null>(null)
  const [emmaOpen, setEmmaOpen] = useState(false)

  useEffect(() => {
    if (!name || arrived || visitorStarted.current) return

    visitorStarted.current = true
    const visitor = actors.current.find(actor => actor.id === 'visitor')!
    visitor.visible = true
    go(visitor, 'visitor')
    focusRef.current('reception')
  }, [name, arrived])

  const select = (id: ActorId) => {
    if (id === 'cat') {
      const cat = actors.current.find(actor => actor.id === id)!
      cat.jump = 0.6
      cat.cue = 'meow'
      cat.cueUntil = time.current + 2
    }

    if (id === 'emma') {
      focus('reception')
      setEmmaOpen(true)
      return
    }

    focus(id === 'shamir' ? 'boss' : id, id)
  }

  useFrame((_, elapsed) => {
    if (document.hidden) return

    const dt = Math.min(elapsed, 0.08)
    time.current += dt

    if (greetingDeadline.current !== null) {
      const settled = motion.current.target === 'reception' &&
        motion.current.revision === request.revision && !motion.current.moving
      if (settled || performance.now() >= greetingDeadline.current) {
        const emma = actors.current.find(actor => actor.id === 'emma')!
        emma.cueUntil = time.current + 8
        greetingDeadline.current = null
      }
    }

    for (const actor of actors.current) {
      if (!actor.route.length) actor.timer -= dt
      routine(actor, actors.current, time.current)

      if (reduced && actor.id === 'cat' && actor.visible) {
        actor.route = []
        if (actor.phase === 'out') {
          actor.phase = 'pause'
          actor.timer = 18
        }
      }

      if (
        actor.phase === 'home' && actor.cueUntil <= time.current &&
        ['esiel', 'kalua', 'shamir'].includes(actor.id)
      ) {
        actor.angle = -Math.PI / 2
      }

      const walking = actor.route.length > 0
      if (walking) {
        const next = actor.route[0]
        const goal: Point = [...nodes[next]]
        const partner = actors.current.find(other => other !== actor && other.id === next)
        if (partner && actor.route.length === 1 && actor.phase === 'out') {
          goal[2] += 0.9
        }

        const dx = goal[0] - actor.position[0]
        const dz = goal[2] - actor.position[2]
        const distance = Math.hypot(dx, dz)
        const speed = actor.id === 'cleaner' ? speeds.cleaner : actor.id === 'cat' ? speeds.cat : speeds.person
        actor.angle = Math.atan2(dx, dz)
        const occupied = actor.id === 'cleaner' && actors.current.some(other =>
          other !== actor && other.route.length && other.node === next && other.route[0] === actor.node,
        )

        if (!occupied) {
          if (reduced) {
            actor.fade -= dt * 4
            if (actor.fade <= 0) reachNode(actor, next, goal)
          } else if (distance < speed * dt) {
            reachNode(actor, next, goal)
          } else {
            actor.position[0] += dx / distance * speed * dt
            actor.position[2] += dz / distance * speed * dt
            actor.position[1] += (goal[1] - actor.position[1]) * Math.min(1, speed * dt / distance)
          }
        }
      } else {
        actor.fade = Math.min(1, actor.fade + dt * 4)
      }

      if (actor.id === 'visitor' && actor.visible && !actor.route.length && !arrived) {
        actor.angle = Math.PI
        const emma = actors.current.find(other => other.id === 'emma')!
        emma.cue = 'greeting'
        emma.cueUntil = Infinity
        greetingDeadline.current = performance.now() + 1500
        visitorArrived()
      }

      if (actor.id === 'emma') {
        actor.position = [-0.1, 0, 3.65]
        actor.angle = 0
      }

      const group = groups.current.get(actor.id)
      if (!group) continue

      group.visible = actor.visible
      const labelElement = labels.current.get(actor.id)
      if (labelElement) labelElement.hidden = !actor.visible
      group.position.set(...actor.position)
      actorPositions[actor.id] = actor.position
      const visual = visuals.current.get(actor.id)
      actor.jump = Math.max(0, actor.jump - dt)
      if (visual) {
        updateActorVisual(visual, {
          angle: actor.angle,
          walking,
          seated: actor.phase === 'home' && ['esiel', 'kalua', 'shamir'].includes(actor.id),
          greeting: actor.id === 'emma' && actor.cueUntil > time.current,
          sweeping: actor.id === 'cleaner' && !walking,
          resting: actor.id === 'cat' && !walking && actor.phase === 'pause',
          jump: actor.jump,
          opacity: actor.fade,
          reduced,
          time: time.current,
        })
      }

      if (actor.id === 'cleaner' && !walking && actor.timer > 0) {
        actor.cueUntil = time.current + 0.2
      }

      const bubble = bubbles.current.get(actor.id)
      if (bubble) {
        const cue = actor.cueUntil > time.current && (!walking || actor.id === 'cat') ? actor.cue : ''
        if (cue === 'greeting') {
          bubble.textContent = t.greeting.replace('{name}', name ?? t.visitorDefault)
        } else if (cue === 'meow') {
          bubble.textContent = t.meow
        } else {
          bubble.textContent = cue ? t.cues[cue as keyof typeof t.cues] ?? '' : ''
        }
        bubble.hidden = !bubble.textContent
      }
    }
  })

  return (
    <>
      {actors.current.map(actor => {
        const id = actor.id
        const label = id === 'visitor' ? name ?? t.visitorDefault : id === 'cat' ? t.cat : t.characters[id]
        const selected = request.target === id || id === 'shamir' && request.target === 'boss'
        const labelVisible = hover === id || selected || id === 'visitor' || id === 'emma' && emmaOpen

        return (
          <group
            key={id}
            ref={group => {
              if (group) groups.current.set(id, group)
            }}
            onClick={event => {
              event.stopPropagation()
              select(id)
            }}
            onPointerOver={event => {
              event.stopPropagation()
              setHover(id)
            }}
            onPointerOut={() => setHover(null)}
          >
            <group ref={group => {
              if (group) visuals.current.set(id, group)
            }}>
              {id === 'cat' ? <CatVisual /> : <PersonVisual color={colors[id]} />}
              {id === 'cleaner' && (
                <group name="broom">
                  <Broom />
                </group>
              )}
            </group>
            <SceneLabel position={[0, id === 'cat' ? 1.3 : 2.65, 0]} center zIndexRange={[25, 0]}>
              <div ref={element => {
                if (element) labels.current.set(id, element)
              }}>
                <button
                  className={`character-label ${labelVisible ? 'is-visible' : ''}`}
                  onClick={() => select(id)}
                >
                  {label}
                </button>
                <span
                  className="ambient-bubble"
                  ref={element => {
                    if (element) bubbles.current.set(id, element)
                  }}
                  hidden
                />
                {id === 'emma' && emmaOpen && (
                  <div className="speech-bubble" role="status">
                    {t.help.replace('{name}', name ?? t.visitorDefault)}
                    <button onClick={() => setEmmaOpen(false)} aria-label={t.close}>
                      {t.close}
                    </button>
                  </div>
                )}
              </div>
            </SceneLabel>
          </group>
        )
      })}
    </>
  )
}
