# Oficina

Oficina isométrica e interactiva del portafolio de Shamir Delgado. Incluye recepción, puestos de trabajo y despacho, con navegación táctil y contenido en español e inglés. Esta primera versión usa geometría primitiva.

Requiere Node 22.12 o superior y npm. El desarrollo local usa Node 26; la publicación usa Node 22.

```sh
npm install
npm run dev
npm run typecheck
npm run build
```

Abrir la dirección local con la ruta `/oficina/`. `?lang=en` abre en inglés; el idioma predeterminado es español. Arrastrar para desplazar y usar la rueda o un gesto de pinza para acercar. Los personajes también se pueden seleccionar con teclado. La barra de destinos aparece solo en desarrollo.

El sitio se publica en GitHub Pages con la ruta base `/oficina/`. Activar GitHub Actions como origen de Pages en la configuración del repositorio.

Los dos proyectos están en `src/content/projects.ts`, con capturas de proporción 16:10 en `public/img/proyectos/`. Los espacios decorativos se configuran en `src/content/wallArt.ts`: colocar imágenes en `public/img/arte/` y asignar su nombre al campo `image`. Los espacios sin imagen conservan un fondo neutro sin texto. El icono se coloca en `public/icon.png`.

## Créditos y licencias de recursos

<!-- Añadir aquí los recursos, sus autores y sus licencias. -->
