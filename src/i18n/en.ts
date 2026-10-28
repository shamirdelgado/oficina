import type { es } from './es'

type Translation = { [Key in keyof typeof es]: typeof es[Key] }

export const en: Translation = {
  title: 'Office | Shamir Delgado',
  description: 'Explore Shamir Delgado’s interactive office: meet the team and discover their projects.',
  back: 'Back to portfolio', language: 'Language', spanish: 'Español', english: 'English', es: 'ES', en: 'EN',
  backShort: 'Portfolio',
  switchToNight: 'Switch to night theme',
  switchToDay: 'Switch to day theme',
  opening: 'Opening the office…', loadingProgress: 'Loading progress',
  welcome: 'Come in, make yourself at home.', subtitle: 'A space to get to know what we do.',
  instructions: 'Drag to explore · Zoom with the wheel or two fingers', navigation: 'Explore the office',
  officePath: '~/oficina',
  overviewTab: 'Overview',
  zones: { reception: 'Reception', projectsWall: 'Projects', breakRoom: 'Break room', boss: 'Office' },
  zoneLabels: { reception: '01 / Reception', projectsWall: '02 / Projects', breakRoom: '03 / Break room', boss: '04 / Office' },
  debug: 'Camera destinations · development',
  fallbackTitle: 'The office needs WebGL',
  fallbackBody: 'This browser cannot display the tour. You can explore my work in the portfolio.',
  scene: 'Interactive office with reception, two workstations and a private office', visit: 'Visit',
  targets: {
    overview: 'Overview', reception: 'Reception', projectsWall: 'Projects', desks: 'Workstations',
    esiel: 'Esiel', kalua: 'Kalua', boss: 'Shamir', breakRoom: 'Break room', cleaner: 'Lia', visitor: 'Visitor',
  },
  projects: {
    pokiot: { name: 'Pokiot', description: 'Your Pokémon card collection in a 3D web experience.' },
    courier: { name: 'Courier Demo', description: 'Shopping forwarding and shipping demo from the US to Costa Rica.' },
  },
  characters: { emma: 'Emma', esiel: 'Esiel', kalua: 'Kalua', shamir: 'Shamir', cleaner: 'Lia' },
  terminal: {
    title: 'esiel ~/oficina',
    lines: [
      'const theme = "night";',
      'const team = [',
      '  "Esiel", "Kalua", "Shamir"',
      '];',
      'function openOffice() {',
      '  return team.map(name => ({',
      '    name,',
      '    status: "creating"',
      '  }));',
      '}',
      'openOffice();',
      '// One project at a time.',
    ],
  },

  nameQuestion: "What's your name?", nameLabel: 'Your name', enter: 'Enter', skip: 'Skip',
  visitorDefault: 'Visitor', changeName: 'Change name', greeting: 'Hi, {name}!',
  help: 'How can I help you, {name}?', close: 'Close', meow: 'meow', cat: 'Chispitas', pikachu: 'Pikachu', pika: '¡Pika pika!',
  pets: { tyrunt: 'Tyrunt', magikarp: 'Magikarp', gastly: 'Gastly' },
  petCries: { tyrunt: 'Grrr!', magikarp: 'Splash!', gastly: 'Heh, heh, heh!' },
  cues: { coffee: '☕', talk: '💬', sweep: '🧹', thinking: '🤔', done: '✓' },
}
