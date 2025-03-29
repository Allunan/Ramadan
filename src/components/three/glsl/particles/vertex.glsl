varying vec3 vPosition;
varying vec2 vUv;
varying vec2 vTexCoords;

uniform float uSize;
uniform vec2 uResolution;
uniform float uTime;
uniform float uInProgress;
uniform float uOutProgress;

#define sat(x) clamp(x, 0., 1.)
#define PI 3.14159265358979323846


float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

//return value between 0 and 1
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// Generate a random angle in radians (0 to 2*PI)
float randomAngle(vec2 st) {
  return random(st) * 2.0 * PI;
}

// Generate random direction based on angle (returns vec2 with unit length)
vec2 randomDirection(vec2 st) {
  float angle = randomAngle(st);
  return vec2(cos(angle), sin(angle));
}

// Generate random direction with random magnitude
vec2 randomVector(vec2 st, float maxMagnitude) {
  vec2 dir = randomDirection(st);
  float magnitude = random(st + dir) * maxMagnitude; // Random magnitude
  return dir * magnitude;
}

void main() {
  vPosition = position;
  vUv = uv;
  
  // Get noise for additional variation
  float noiseValue = noise(vec3(position.x, position.y, random(position.xy) * uTime));
  
  // Generate random direction based on angle
  vec2 randomDir = randomVector(position.xy, 100.0);
  
  // Apply the random direction with noise modification
  float x = position.x + randomDir.x + noiseValue * (1. - uInProgress) * 100.;
  float y = position.y + randomDir.y + noiseValue * (1. - uInProgress) * 100.;
  
  // Interpolate back to original position based on progress
  x = mix(x, position.x, uInProgress);
  y = mix(y, position.y, uInProgress);

  float yOut = y - noise(vec3(position.x, position.y, 0)) * 100.;

  y = mix(y, yOut, uOutProgress);
  
  vec4 modelPosition = modelMatrix * vec4(x, y, position.z, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;

  // Final size
  gl_PointSize = uSize * uResolution.y;
  gl_PointSize *= 1.0 / -viewPosition.z;

  vTexCoords = vec2(position.x, position.y);
}

