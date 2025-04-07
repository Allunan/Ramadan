varying vec3 vPosition;
varying vec2 vUv;
varying vec2 vTexCoords;
varying float vMask;
varying float vNoise;
varying float vUp;
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


float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}

vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float perlinNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    float a = dot(hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0));
    float b = dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
    float c = dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
    float d = dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));
    
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// Fractal Brownian Motion (FBM) Noise
float fbm(vec2 p) {
    float total = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < 5; i++) {
        total += amplitude * perlinNoise(p * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    
    return total;
}

float fmbMaker(vec2 uv, float scale) {
    vec2 scaledUV = uv * scale;
    float noise = fbm(scaledUV);
    
    
    return noise;
}

float sdfCircle(vec2 uv, vec2 center, float radius) {
    float dist = length(uv - center) - radius;
    return dist;
}

float burnEffect(){
    
    
    float uScale = 10.0;
    
    float noise = fmbMaker(uv, uScale);

    float time = uOutProgress * 2.;
    float mask = 1.;
    
    for (float i = 0.; i < 4.; i++){
        float seed = i + 9.;
        vec2 hash = hash(vec2(seed));
        float t = (sin(time + PI * 1.5)) * 0.5 + 0.5;
        t*=1.1;
        float circle = sdfCircle(uv + noise , hash * 2.,  3. * (-.3+t) );
        mask = min(mask, circle);

    }
    
    return mask;
}

// Generate random direction with random magnitude
vec2 randomVector(vec2 st, float maxMagnitude) {
  vec2 dir = randomDirection(st);
  float magnitude = random(st + dir) * maxMagnitude; // Random magnitude
  return dir * magnitude;
}

// Function to create oscillating movement for sand particles
float oscillate(float time, float frequency, float amplitude) {
    return sin(time * frequency) * amplitude;
}

void main() {
  vPosition = position;
  vUv = uv;

  
  // Get noise for additional variation
  float noiseValue = noise(vec3(position.x, position.y, random(position.xy) * uTime));
  vNoise = noiseValue;
  
  // Create wind direction (from left to right)
  float windStrength = 150.0; // Adjust for stronger/weaker wind
  float windDirection = -1.0; // Negative for left direction
  
  // Create oscillating movement for sand particles
  float particleId = random(position.xy); // Unique ID for each particle
  float oscillationSpeed = 2.0 + particleId * 3.0; // Varying speeds
  float oscillationAmplitude = 5.0 + particleId * 10.0; // Varying amplitudes
  
  // Calculate oscillation based on time and particle ID
  float oscillation = oscillate(uTime + particleId * 10.0, oscillationSpeed, oscillationAmplitude);
  
  // Apply wind effect with noise and oscillation
  float x = position.x + windDirection * windStrength * (1.0 - uInProgress) * noiseValue;
  
  // Add oscillating vertical movement that decreases over time
  float verticalOscillation = oscillation * (1.0 - uInProgress) * (1.0 - sat(uInProgress * 2.0));
  float y = position.y + verticalOscillation + noiseValue * (1.0 - uInProgress) * 20.0;
  
  // Add some randomness to the vertical movement for sand-like effect
  float randomY = random(vec2(position.x, position.y + uTime * 0.1)) * 2.0 - 1.0;
  y += randomY * (1.0 - uInProgress) * 5.0;
  
  // Interpolate back to original position based on progress
  x = mix(x, position.x, uInProgress);
  y = mix(y, position.y, uInProgress);

  float mask = burnEffect();
  vMask = mask;

  float up = smoothstep(-.5, 1., (mask));
  up = pow(up, 0.1);
  up = 1. - up;

  vUp = up;

  x = mix(x, x + 1000. * abs(randomY), up);
  
  vec4 modelPosition = modelMatrix * vec4(x, y, position.z, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;

  // Final size
  gl_PointSize = uSize * uResolution.y;
  gl_PointSize *= 1.0 / -viewPosition.z;

  vTexCoords = vec2(position.x, position.y);
}

