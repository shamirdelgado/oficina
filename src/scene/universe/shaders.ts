// Estado expandido de universo.js del portafolio; conserva ruido, capas y ondas.
export const vertexShader = `
attribute vec4 aAzar;
attribute vec4 aCelda;
uniform float uTiempo, uOndaTiempo, uPixel, uReducido, uDia, uActivo;
uniform vec2 uVista, uPuntero;
varying vec4 vCelda;
varying float vGiro, vAlfa;
varying vec3 vColor;
float ruido(float t) {
  float i = floor(t), f = fract(t);
  f = f*f*(3.-2.*f);
  return mix(fract(sin(i*127.1)*43758.5453),fract(sin((i+1.)*127.1)*43758.5453),f)*2.-1.;
}
void main() {
  vec3 p = position;
  float capa = floor(aAzar.z * 4.0);
  p.xy *= uVista * .5;
  p.y += ruido(uTiempo * (.12 + aAzar.x * .13) + aAzar.y * 30.) * (7. + capa * 3.);
  p.x += ruido(uTiempo * .16 + aAzar.x * 30.) * (8. + capa * 4.);
  p.y = mod(p.y + uVista.y * .6, uVista.y * 1.2) - uVista.y * .6;
  p.xy *= (1500.-p.z)/1500.;
  vec2 d = p.xy - uPuntero*uVista*.5*(1500.-p.z)/1500.;
  float distancia = length(d);
  float edadCampo = uTiempo-uOndaTiempo-distancia/650.;
  float resorte = (1.-exp(-max(0.,uTiempo-uOndaTiempo)*5.)*cos(max(0.,uTiempo-uOndaTiempo)*9.));
  float empuje = exp(-distancia*distancia/22000.)*65.*uActivo*resorte;
  float eco = sin(max(0.,edadCampo)*10.)*exp(-max(0.,edadCampo)*3.)*step(0.,edadCampo)*22.;
  p.xy += normalize(d+.001)*(empuje+eco)*(1.-uReducido);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
  float tamano = mix(8., 24., aAzar.z) * (uVista.x < 760. ? .78 : 1.);
  gl_PointSize = tamano * uPixel * 1500. / (1500.-p.z);
  vCelda = aCelda;
  vGiro = aAzar.y * 6.28 + uTiempo * (aAzar.x - .5) * .12;
  vAlfa = mix(.12, .46, aAzar.z) * (uVista.x < 760. ? 1.2 : 1.);
  vColor = mix(vec3(.72,.75,.91), vec3(.92,.89,1.), aAzar.x);
  vColor = mix(vColor, mix(vec3(.20,.08,.34),vec3(.30,.14,.46),aAzar.x), uDia);
}`

export const fragmentShader = `
uniform sampler2D uAtlas;
varying vec4 vCelda;
varying float vGiro, vAlfa;
varying vec3 vColor;
void main() {
  vec2 q = gl_PointCoord - .5;
  q = mat2(cos(vGiro),-sin(vGiro),sin(vGiro),cos(vGiro)) * q + .5;
  if (min(q.x,q.y) < 0. || max(q.x,q.y) > 1.) discard;
  float alfa = texture2D(uAtlas, vCelda.xy + vec2(q.x, 1.-q.y) * vCelda.zw).a;
  if (alfa * vAlfa < .008) discard;
  gl_FragColor = vec4(vColor, alfa * vAlfa);
}`
