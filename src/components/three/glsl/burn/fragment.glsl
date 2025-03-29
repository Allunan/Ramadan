uniform sampler2D uTexture;
uniform vec2 uImageSize;
uniform vec2 uResolution;
uniform float uInProgress;
uniform float uOutProgress; // Controls the burn transition
uniform float uTime;
uniform float uNbLines;
uniform float uNbColumns;

varying vec3 vPosition;
varying vec2 vUv;
varying vec4 vColor;
varying float vMask;
varying float vNoise;
varying vec2 vTexCoords;


// SDF Function for Circles
float sdfCircle(vec2 uv, vec2 center, float radius) {
    float dist = length(uv - center) - radius;
    return dist;
}

void main() {

    vec2 tuv = gl_PointCoord;
    tuv.y *= -1.;
    tuv /= vec2(uNbColumns, uNbLines);
    float texOffsetU = vTexCoords.x / uNbColumns;
    float texOffsetV = vTexCoords.y / uNbLines;
    tuv += vec2(texOffsetU, texOffsetV);
    tuv += 0.5;
    vec4 textureFinal = texture2D(uTexture, tuv);

    float circle = sdfCircle(gl_PointCoord, vec2(0.5), 0.2);
    circle = smoothstep(0.2, 0.0, circle);

    float visible = smoothstep(0., 0.2, uInProgress);
    float visibleOut = 1. - uOutProgress;

    gl_FragColor = textureFinal;
    gl_FragColor.a *= circle * visible * visibleOut;


    float mask = vMask;
    vec4 color = gl_FragColor;
    float noise = vNoise;
    // Create distortion based on the burn mask
    vec2 distortion = vec2(noise, noise) / uResolution.xy;
    vec2 uvDistortion = distortion * 500.5 * smoothstep(0.5, 0.0, mask);
    
    // Get the distorted texture
    vec4 distortedTex = texture2D(uTexture, tuv + uvDistortion);
    
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
    glowAmount = 1.0 - pow(glowAmount, 0.1);
    col += glowAmount * vec3(1.0, 0.2, 0.05);
    
    // Replace color with burning effect
    color.rgb = col;
    
    // Adjust alpha at the burn edges
    float alphaFactor = 1.0 - smoothstep(0.0, 0.3, -mask); 
    color.a *= alphaFactor;

    gl_FragColor = color;
    // gl_FragColor = vec4(vec3(vMask), 1.);

}
