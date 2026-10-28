import { box, capsule, sphere } from './parts'
import type { Part } from './parts'

export type PersonSkin = 'emma' | 'esiel' | 'kalua' | 'shamir' | 'lia' | 'visitor'
export type PersonPieces = { body: Part[]; arm: Part[]; standing: Part[]; seated: Part[] }
export const skinTone = '#d4a17f'
export const black = '#1c1a22'
export const white = '#eef2f5'
export function person(top: string, pants: string, shoes: string, gloves = skinTone): PersonPieces {
  const legs = (seated: boolean) => [-0.16, 0.16].flatMap(x => seated ? [
    box(pants, [x, 0.69, 0.2], [0.23, 0.23, 0.62]),
    box(pants, [x, 0.4, 0.44], [0.22, 0.52, 0.23]),
    box(shoes, [x, 0.14, 0.51], [0.25, 0.23, 0.37]),
  ] : [
    box(pants, [x, 0.43, 0], [0.23, 0.64, 0.25]),
    box(shoes, [x, 0.12, 0.06], [0.25, 0.24, 0.37]),
  ])
  return {
    body: [
      capsule(top, [0, 1.14, 0], [1.1, 0.79, 0.67]),
      capsule(skinTone, [0, 1.77, 0], [0.94, 0.48, 0.88]),
      ...[-0.085, 0.085].map(x => sphere('#211c29', [x, 1.79, 0.215], [0.035, 0.04, 0.025])),
    ],
    arm: [box(top, [0, -0.15, 0], [0.18, 0.37, 0.22]), capsule(gloves, [0, -0.43, 0.015], [0.32, 0.23, 0.35])],
    standing: legs(false), seated: legs(true),
  }
}
export function collar(color = white): Part[] {
  return [-1, 1].map(side => box(color, [side * 0.095, 1.47, 0.14], [0.12, 0.19, 0.06], [0, 0, side * 0.45]))
}
export function emblem(position: [number, number, number], scale = 1): Part[] {
  const [x, y, z] = position
  return [
    box('#d8312f', [x - 0.055 * scale, y, z], [0.035 * scale, 0.19 * scale, 0.018]),
    box('#d8312f', [x, y + 0.08 * scale, z], [0.12 * scale, 0.035 * scale, 0.018]),
    box('#d8312f', [x + 0.055 * scale, y + 0.04 * scale, z], [0.035 * scale, 0.08 * scale, 0.018]),
    box('#d8312f', [x, y, z], [0.12 * scale, 0.035 * scale, 0.018]),
    box('#d8312f', [x + 0.025 * scale, y - 0.055 * scale, z], [0.035 * scale, 0.13 * scale, 0.018], [0, 0, 0.6]),
  ]
}
