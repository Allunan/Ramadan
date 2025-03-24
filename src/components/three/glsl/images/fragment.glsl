uniform sampler2D uTexture;
uniform vec2 uImageSize;
uniform vec2 uResolution;
uniform float uProgress;
uniform float uFadeProgress; // Controls the burn transition
uniform float uTime;

varying vec3 vPosition;
varying vec2 vUv;
varying float vProgress;       // Position progress
varying float vFadeProgress;   // Separate fade-out progress
varying vec4 vColor;
varying float vMask;

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

void main() {
    // Get the base texture color
    vec4 texColor = texture2D(uTexture, vUv);
    
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

        mask = vMask;
        
        // Skip expensive operations if mask is too large
        if (mask < 0.5) {
            // Create distortion based on the burn mask
            vec2 distortion = vec2(noise, noise) / uResolution.xy;
            vec2 uvDistortion = distortion * 500.5 * smoothstep(0.5, 0.0, mask);
            
            // Get the distorted texture
            vec4 distortedTex = texture2D(uTexture, uv + uvDistortion);
            
            // Create the burning effect
            float burnAmount = 1.0 - exp(-mask*mask * 100.0);
            vec3 col = vec3(distortedTex.rgb);
            col = mix(vec3(0.0), col, burnAmount);
            
            // Add the fiery glow at the edges
            vec3 FIRE_COLOR = vec3(1.00, 0.5, 0.2);
            float orangeAmount = smoothstep(0.0, 1.0, mask);
            orangeAmount = pow(orangeAmount, 0.07);
            col = mix(FIRE_COLOR, col, orangeAmount);
            
            // Apply darkness where the burn is complete
            col = mix(vec3(0.0), col, smoothstep(0.0, 0.1, mask));
            
            // Add a fiery glow
            float glowAmount = smoothstep(0.0, 1.0, abs(mask));
            glowAmount = 1.0 - pow(glowAmount, 0.2);
            col += glowAmount * vec3(1.0, 0.2, 0.05);
            
            // Replace color with burning effect
            color.rgb = col;
            
            // Adjust alpha at the burn edges
            float alphaFactor = 1.0 - smoothstep(0.0, 0.3, -mask); 
            color.a *= alphaFactor;
        }
    // mask = smoothstep(0.1, 0., (mask));
    // color = vec4(vec3(mask), 1.0);
    }
    // color = vColor;
    
    // Apply the regular fade-in from movement
    color.a *= fadeInFactor;

    
    gl_FragColor = color;
}
