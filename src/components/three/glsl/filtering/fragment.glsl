uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform float uInProgress;
uniform float uOutProgress;

varying vec2 vUv;

vec4 blur13(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(1.411764705882353) * direction;
  vec2 off2 = vec2(3.2941176470588234) * direction;
  vec2 off3 = vec2(5.176470588235294) * direction;
  vec2 off4 = vec2(7.0588235294117645) * direction;
  vec2 off5 = vec2(8.941176470588234) * direction;
  color += texture2D(image, uv) * 0.1964825501511404;
  color += texture2D(image, uv + (off1 / resolution)) * 0.2969069646728344;
  color += texture2D(image, uv - (off1 / resolution)) * 0.2969069646728344;
  color += texture2D(image, uv + (off2 / resolution)) * 0.09447039785044732;
  color += texture2D(image, uv - (off2 / resolution)) * 0.09447039785044732;
  color += texture2D(image, uv + (off3 / resolution)) * 0.010381362401148057;
  color += texture2D(image, uv - (off3 / resolution)) * 0.010381362401148057;

  return color;
}

vec4 fadeOut(vec4 color, float progress) {
  return vec4(color.rgb, color.a * progress);
}

void main () {
    vec2 uv = vUv;
    vec4 color = blur13(uTexture, uv, uResolution, vec2(1.0, 1.0) * (1.0 - uInProgress));
    vec4 textureColor = texture2D(uTexture, uv);
    color.a *= textureColor.a;
    color = fadeOut(color, (1.- uOutProgress));

    gl_FragColor =color;
}