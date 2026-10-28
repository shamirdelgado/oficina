// ratio = ancho / alto; admite 9:16 y cualquier proporción. La imagen conserva su medida real.
export type WallArtSlot = {
  id: string
  zone: 'reception' | 'breakRoom' | 'boss'
  position: [number, number, number]
  rotation: number
  width: number
  ratio: number
  image: string
}

export const wallArt: WallArtSlot[] = [
  { id: 'reception-lirios', zone: 'reception', position: [-6.82, 2.15, 4.9], rotation: Math.PI / 2, width: 1.45, ratio: 629 / 900, image: 'lirios.webp' },
  { id: 'break-room-perrito', zone: 'breakRoom', position: [8.45, 1.43, -2.9], rotation: 0, width: 0.82, ratio: 659 / 900, image: 'perrito.webp' },
  { id: 'boss-tigre', zone: 'boss', position: [-3.7, 2.1, -7.82], rotation: 0, width: 1.42, ratio: 519 / 900, image: 'tigre.webp' },
  { id: 'boss-retrato', zone: 'boss', position: [0, 2.1, -7.82], rotation: 0, width: 1.34, ratio: 492 / 900, image: 'retrato.webp' },
  { id: 'boss-cisnes', zone: 'boss', position: [3.7, 2.1, -7.82], rotation: 0, width: 2.4, ratio: 900 / 882, image: 'cisnes.webp' },
  { id: 'shamir-desk', zone: 'boss', position: [0.25, 1.647, -3.95], rotation: Math.PI / 2, width: 0.42, ratio: 656 / 900, image: 'crayon.webp' },
]
