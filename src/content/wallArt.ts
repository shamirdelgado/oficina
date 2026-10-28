// Guarda la imagen en public/img/arte/ y añade image: 'poster-xx.webp' al espacio.
// ratio = ancho / alto (2:3, 3:4, 1:1, 4:3 o 16:10); posiciones globales y giro en radianes.
export type WallArtSlot = {
  id: string
  zone: 'reception' | 'desks' | 'breakRoom' | 'boss'
  position: [number, number, number]
  rotation: number
  width: number
  ratio: number
  image?: string
}

export const wallArt: WallArtSlot[] = [
  { id: 'reception-01', zone: 'reception', position: [-6.82, 2.25, 3.6], rotation: Math.PI / 2, width: 1.1, ratio: 2 / 3 },
  { id: 'reception-02', zone: 'reception', position: [-6.82, 2.25, 5.2], rotation: Math.PI / 2, width: 1.1, ratio: 3 / 4 },
  { id: 'reception-03', zone: 'reception', position: [-6.82, 2.25, 6.8], rotation: Math.PI / 2, width: 1.1, ratio: 1 },
  { id: 'desks-01', zone: 'desks', position: [-3.6, 2.3, -3.17], rotation: 0, width: 1.1, ratio: 4 / 3 },
  { id: 'desks-02', zone: 'desks', position: [-0.7, 2.3, -3.17], rotation: 0, width: 1.1, ratio: 16 / 10 },
  { id: 'esiel-desk', zone: 'desks', position: [-1.95, 1.647, 0.95], rotation: Math.PI / 2, width: 0.42, ratio: 3 / 4 },
  { id: 'kalua-desk', zone: 'desks', position: [2.35, 1.647, 0.95], rotation: Math.PI / 2, width: 0.42, ratio: 3 / 4 },
  { id: 'break-room-01', zone: 'breakRoom', position: [8.3, 1.172, -2.9], rotation: 0, width: 0.62, ratio: 1 },
  { id: 'break-room-02', zone: 'breakRoom', position: [9.1, 1.583, -2.85], rotation: 0, width: 0.48, ratio: 4 / 3 },
  { id: 'boss-01', zone: 'boss', position: [-3.6, 2.3, -7.82], rotation: 0, width: 1.25, ratio: 3 / 4 },
  { id: 'boss-02', zone: 'boss', position: [0, 2.3, -7.82], rotation: 0, width: 1.5, ratio: 1 },
  { id: 'boss-03', zone: 'boss', position: [3.9, 2.3, -7.82], rotation: 0, width: 1.55, ratio: 16 / 10 },
  { id: 'boss-04', zone: 'boss', position: [-6.82, 2.3, -4.7], rotation: Math.PI / 2, width: 1.15, ratio: 2 / 3 },
  { id: 'shamir-desk', zone: 'boss', position: [0.25, 1.647, -3.95], rotation: Math.PI / 2, width: 0.42, ratio: 3 / 4 },
]
