import { wallArt } from '../content/wallArt'
import { ImageFrame } from './ImageFrame'

export function WallArt() {
  return <group>
    {wallArt.map(({ id, image, position, rotation, width, ratio }) =>
      <ImageFrame key={id} position={position} rotation={rotation} width={width} ratio={ratio}
        image={`${import.meta.env.BASE_URL}img/arte/${image}`} />)}
  </group>
}
