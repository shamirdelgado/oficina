const paths = {
  pencil: 'M11 1h2v1h1v1h1v2h-2V4h-1V3h-1zM9 3h2v2h2v2h-2V6h-1V5H9zM8 4h1v2h1v1h2v1h-1v1h-1v1H9v1H8v1H7v1H5v-2H3V9h1V8h1V7h1V6h1V5h1zM2 10h1v3h3v1H1v-1h1z',
  reception: 'M7 2h2v2H7zM4 5h8v2H4zM2 7h12v3H2zM1 11h14v2H1zM2 13h2v2H2zM12 13h2v2h-2z',
  projectsWall: 'M1 2h14v10H1zM3 4v6h10V4zM7 12h2v2h4v1H3v-1h4zM5 5h2v1H6v2h1v1H5zM9 5h2v4H9V8h1V6H9z',
  breakRoom: 'M3 1h2v3H3zM7 1h2v3H7zM2 5h10v1h3v6h-4v1H3v-2H2zM12 8v2h1V8zM1 14h13v1H1z',
  boss: 'M3 1h10v14H3zM5 3v10h6V3zM8 8h2v2H8zM1 14h2v1H1zM13 14h2v1h-2z',
  overview: 'M1 1h5v2H3v3H1zM10 1h5v5h-2V3h-3zM1 10h2v3h3v2H1zM13 10h2v5h-5v-2h3zM6 6h4v4H6z',
}

export function PixelIcon({ name }: { name: keyof typeof paths }) {
  return <svg className="pixel-icon" viewBox="0 0 16 16" width="24" height="24"
    aria-hidden="true" focusable="false" fill="currentColor" shapeRendering="crispEdges">
    <path d={paths[name]} fillRule="evenodd" />
  </svg>
}
