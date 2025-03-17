uniform sampler2D uTexture;
uniform vec2 uImageSize;
uniform vec2 uResolution;
uniform float uProgress;
uniform float uFadeProgress; // New uniform for independent fade-out control

varying vec3 vPosition;
varying vec2 vUv;
varying float vProgress;       // Position progress
varying float vFadeProgress;   // Separate fade-out progress

// SDF Function (Same as before)
float sdfCircle(vec2 uv, float radius) {
    return length(uv) - radius;
}

void main() {
    vec4 texColor = texture2D(uTexture, vUv);
  
    vec4 color = texColor;

    // Fade-in based on movement progress
    float fadeInFactor = smoothstep(0.0, 0.2, vProgress); 

    // Separate fade-out animation based on uFadeProgress
    float fadeOutFactor = 1.0 - smoothstep(0.0, 1.0, uFadeProgress); 

    // Combine both fade-in and fade-out effects
    color.a *= fadeInFactor * fadeOutFactor;

    // Discard particles that are fully transparent
    // if (color.a < 0.05) discard;

    gl_FragColor = color;
}
