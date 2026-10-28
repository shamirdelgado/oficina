import { useSyncExternalStore } from 'react'

let name: string | null = null
try { name = sessionStorage.getItem('office-visitor')?.trim().slice(0, 24) || null } catch { /* Almacenamiento opcional. */ }
let arrived = false
let editing = !name
const listeners = new Set<() => void>()
let snapshot = { name, arrived, editing }
function emit() { snapshot = { name, arrived, editing }; listeners.forEach(listener => listener()) }
export function setVisitor(value: string) {
  name = value.trim().slice(0, 24)
  editing = false
  try { sessionStorage.setItem('office-visitor', name) } catch { /* Almacenamiento opcional. */ }
  emit()
}
export function visitorArrived() { arrived = true; emit() }
export function editVisitor() { editing = true; emit() }
export function useVisitor() {
  return useSyncExternalStore(callback => { listeners.add(callback); return () => { listeners.delete(callback) } }, () => snapshot)
}
