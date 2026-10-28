import { es } from '../i18n/es'
import { en } from '../i18n/en'

const imageRoot = `${import.meta.env.BASE_URL}img/proyectos/`

export const projects = [
  {
    id: 'pokiot',
    name: es.projects.pokiot.name,
    image: `${imageRoot}pokiot.webp`,
    liveUrl: 'https://pokiot.vercel.app',
    description: { es: es.projects.pokiot.description, en: en.projects.pokiot.description },
  },
  {
    id: 'courier',
    name: es.projects.courier.name,
    image: `${imageRoot}courier.webp`,
    liveUrl: 'https://shamirdelgado.github.io/courier-demo/',
    codeUrl: 'https://github.com/shamirdelgado/courier-demo',
    description: { es: es.projects.courier.description, en: en.projects.courier.description },
  },
] as const
