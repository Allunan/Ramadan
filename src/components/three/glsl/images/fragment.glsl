uniform sampler2D uTexture;
uniform vec2 uImageSize;
uniform vec2 uResolution;
uniform float uProgress;

varying vec3 vPosition;
varying vec2 vUv;
varying float vProgress; // Receive progress from vertex shader

float sdfCircle(vec2 uv, float radius) {
  return length(uv) - radius;
}

void main() {
  vec4 texColor = texture2D(uTexture, vUv);
  
  vec4 color = texColor;

  float opacityFactor = smoothstep(0.4, 1., vProgress); 
  color.a *= opacityFactor; 


  gl_FragColor = color;
  //gl_FragColor = vec4(opacityFactor);
}
