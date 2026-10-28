import { Component, useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { PCFShadowMap } from 'three'
import { useLanguage } from './i18n'
import { Office } from './scene/Office'
import { CameraRig } from './scene/CameraRig'
import { Universe } from './scene/Universe'
import { TopBar } from './ui/TopBar'
import { LoadingScreen } from './ui/LoadingScreen'
import { useVisitor } from './state/visitor'
import { VisitorDialog } from './ui/VisitorDialog'
import { Navigation } from './ui/Navigation'
import { TourInstructions } from './ui/TourInstructions'
import { useTheme } from './state/theme'

function Fallback() {
  const { t, language } = useLanguage()
  return (
    <main className="fallback">
      <h1>{t.fallbackTitle}</h1>
      <p>{t.fallbackBody}</p>
      <a href={`https://shamirdelgado.github.io/?lang=${language}`}>{t.back}</a>
    </main>
  )
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (this.state.failed) return <Fallback />
    return this.props.children
  }
}

function FirstFrame({ onReady }: { onReady: () => void }) {
  const [rendered, setRendered] = useState(false)

  useFrame(() => {
    if (!rendered) setRendered(true)
  })
  useEffect(() => {
    if (rendered) onReady()
  }, [rendered, onReady])

  return null
}

function Scene() {
  const { theme } = useTheme()
  const night = theme === 'night'
  const { arrived } = useVisitor()
  const [ready, setReady] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const onLoaded = useCallback(() => setLoaded(true), [])
  const [quality, setQuality] = useState(true)
  const { t } = useLanguage()

  return (
    <>
      <main className="office-view" aria-label={t.scene}>
        <div id="scene-labels" className="scene-labels" />
        <Canvas
          orthographic
          camera={{ position: [19, 19, 19], zoom: 25, near: 0.1, far: 100 }}
          dpr={[1, quality ? 1.5 : 1]}
          shadows={quality ? { type: PCFShadowMap } : false}
          gl={{ antialias: true, alpha: true, powerPreference: 'default' }}
          fallback={<Fallback />}
        >
          <hemisphereLight args={[night ? '#cbb5ed' : '#fff3ee', night ? '#332044' : '#c4afd5', night ? 1.25 : 2.1]} />
          <directionalLight
            position={[0, 15, 5]}
            color={night ? '#ffd3a0' : '#ffe8d2'}
            intensity={night ? 1.9 : 2.8}
            castShadow={quality}
            shadow-mapSize={[1024, 1024]}
            shadow-camera-left={-12}
            shadow-camera-right={12}
            shadow-camera-top={12}
            shadow-camera-bottom={-12}
            shadow-camera-near={1}
            shadow-camera-far={30}
            shadow-normalBias={0.045}
            shadow-bias={-0.0002}
            shadow-radius={3}
          />
          <PerformanceMonitor
            onDecline={() => setQuality(false)}
            onFallback={() => setQuality(false)}
            flipflops={2}
          >
            <Office />
          </PerformanceMonitor>
          <Universe quality={quality} />
          <CameraRig />
          <FirstFrame onReady={() => setReady(true)} />
        </Canvas>
      </main>
      {!arrived && (
        <div className="intro">
          <h1>{t.welcome}</h1>
          <p>{t.subtitle}</p>
        </div>
      )}
      <footer className="tour-footer">
        <TourInstructions />
        <Navigation />
      </footer>
      <VisitorDialog ready={loaded} />
      <LoadingScreen ready={ready} onComplete={onLoaded} />
    </>
  )
}

export function App() {
  return (
    <>
      <TopBar />
      <SceneBoundary><Scene /></SceneBoundary>
    </>
  )
}
