uniform sampler2D uTexture;
uniform vec2 uImageSize;
uniform vec2 uResolution;
uniform float uProgress;
varying vec3 vPosition;
varying vec2 vUv;

float sdfCircle(vec2 uv, float radius) {
  return length(uv) - radius;
}

void main() {
  
  vec4 texColor = texture2D(uTexture, vUv);
  if(texColor.a < 0.5) discard;
  vec4 color = texColor;
  float progress = smoothstep(0., vUv.x, uProgress);
  // color.a = mix(0., 1., progress);
  color.a *= sdfCircle(vUv, 0.5);
  gl_FragColor = color;
  //gl_FragColor = vec4(vec3(color.a), 1.);
}
