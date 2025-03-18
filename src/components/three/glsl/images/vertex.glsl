varying float vProgress; // Pass progress to the fragment shader
varying float vFadeProgress; // Pass fade progress to the fragment shader
varying vec3 vPosition;
varying vec2 vUv;
uniform float uSize;
uniform vec2 uResolution;
uniform float uTime;
uniform float uProgress;
uniform float uFadeProgress;
varying vec4 vColor;

//	Classic Perlin 3D Noise 
//	by Stefan Gustavson (https://github.com/stegu/webgl-noise)
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec3 P){
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}



// Utility functions
#define sat(x) clamp(x, 0., 1.)

float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}

// Hash function for pseudo-random values
vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

// Perlin-style noise function
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

// FBM Noise Generator with Scale
float fmbMaker(vec2 uv, float scale) {
    vec2 scaledUV = uv * scale;
    float noise = fbm(scaledUV);
    return noise;
}

// SDF Function for Circles
float sdfCircle(vec2 uv, vec2 center, float radius, float smoothness) {
    float dist = length(uv - center) - radius;
    return dist;
}


vec4 movingParticlesUp(){
  // Get the base texture color
    vec4 texColor = vec4(1.0, 0.0, 0.0, 1.0);
    
    // Initialize with the texture color
    vec4 color = texColor;
    
    // Fade-in based on movement progress
    float fadeInFactor = smoothstep(0.0, 0.2, vProgress);
    
    // Only apply burn effect if fadeProgress is greater than 0
    if (vFadeProgress > 0.01) {
        // Normalized coordinates for the burn effect
        vec2 uv = vUv;
        vec2 nuv = uv - 0.5;
        nuv *= 2.0;
        nuv.x *= uResolution.x / uResolution.y;
        
        // Generate FBM noise using the function
        float noise = fmbMaker(uv, 10.0);
        
        // Create multiple circles as masks
        float time = uTime * 0.5;
        float mask = 1.0;
        
        for (int i = 0; i < 8; i++) {
            float seed = float(i) + 9.0;
            vec2 randPos = hash(vec2(seed));
            
            // Using vFadeProgress directly to control the transition
            float t = vFadeProgress;
            float circle = sdfCircle(nuv + noise, randPos * 2.0, 3.0 * t, 0.1);
            
            // Compute minimum for mask
            mask = min(mask, circle);
        }
        
       
    mask = smoothstep(.1, 0., (mask));
    color = vec4(vec3(mask), 1.0);
    }
    vColor = color;
    return color;
}

void main() {
  vPosition = position;
  vUv = uv;
  vFadeProgress = uFadeProgress; // Pass the fade progress to the fragment shader

  // Generate noise for randomness
  float noiseOffset = cnoise(vec3(position.xy * 10.0, uTime * 0.5)); 
  float startOffset = noiseOffset * 5.0; 

  // Make left side stabilize first
  float rawProgress = smoothstep(0.0, 1.0, uProgress + (1.0 - uv.x) * 0.5);

  // Apply cubic ease-out for smooth motion
  vProgress = 1.0 - pow(1.0 - rawProgress, 3.0); 

  // Additional leftward movement when uProgress == 0
  float leftwardOffset = mix(-5.0 * (1.0 - uv.x), 0.0, uProgress); 

  // Move particles from left to right
  float x = mix(-5.0 + noiseOffset * 2.0 + leftwardOffset, position.x, vProgress); 
  float y = mix(position.y + noiseOffset * 1.5, position.y, vProgress); 
  float z = mix(position.z + noiseOffset * 1.5, position.z, vProgress); 

  vec4 offsetUp = movingParticlesUp();
  y = mix(y, y + 1., offsetUp.y);
  // Apply transformation matrices
  vec4 modelPosition = modelMatrix * vec4(x, y, z, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;

  // Final size
  gl_PointSize = uSize * uResolution.y;
  gl_PointSize *= 1.0 / -viewPosition.z;
}

