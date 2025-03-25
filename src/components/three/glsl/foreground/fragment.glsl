varying vec2 vUv;

uniform sampler2D uTexture;
void main() {
    vec4 textureColor = texture2D(uTexture, vUv * 5.0);
    float middleLine = abs(vUv.x - 0.5);
    middleLine = smoothstep(0.002, 0.0, middleLine);
    middleLine *= textureColor.r;

    vec2 cell = fract((vUv - vec2(0.25) )* 2.0);
    cell = abs(cell - 0.5) * 2.;
    float distanceToCenter = max(cell.x, cell.y);
    float rects = smoothstep(0.99, 1., distanceToCenter);
    rects *= textureColor.r;
    float alpha = middleLine + rects;
    float final = rects + middleLine;
    gl_FragColor = vec4(vec3(final), alpha);
}