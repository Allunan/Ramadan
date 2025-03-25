varying vec2 vUv;

uniform sampler2D uTexture;
void main() {
    vec3 baseColor = vec3(0.89,0.561,0.071);
    vec4 textureColor = texture2D(uTexture, vUv * 10.0);
    float final = textureColor.r * 0.25;
    final = 1.0 - final;
    final *= .6;
    gl_FragColor = vec4(baseColor * vec3(final), final);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}