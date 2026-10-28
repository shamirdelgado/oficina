import { useTheme } from '../state/theme'

const night = {
  wood: '#a87755', cream: '#43324f', purple: '#7343bf', terracotta: '#875b71',
  ink: '#171020', leaf: '#547d70', leafLight: '#80a28b', metal: '#554365',
  wall: '#3b2b50', wallBack: '#453258', floor: '#2a1e38', mat: '#695578',
  boards: ['#35273f', '#392b43', '#3c2d46', '#34263e'],
  rug: '#2b1c3f', officeFloor: '#30213f', tile: '#342b40', glass: '#b899f4',
  strip: '#b899f4', screen: '#8ce7ea',
}
const day: typeof night = {
  wood: '#c69269', cream: '#eee5ee', purple: '#9874bf', terracotta: '#c3939c',
  ink: '#30233e', leaf: '#719581', leafLight: '#9bb79b', metal: '#897594',
  wall: '#e4d9ee', wallBack: '#eee4f1', floor: '#cbbbd4', mat: '#c7b5d3',
  boards: ['#dfd1de', '#e4d8e2', '#d9cbd9', '#e0d3df'],
  rug: '#c4aed6', officeFloor: '#d4c1da', tile: '#e8dfeb', glass: '#b9d8dd',
  strip: '#7343bf', screen: '#8ce7ea',
}

export const palette = night
export function useOfficePalette() {
  const { theme } = useTheme()
  return theme === 'night' ? night : day
}
