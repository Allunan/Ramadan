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

}
