uniform float uMagnitude;

uniform float uMin;
uniform float uMax;

uniform float uMinRange;
uniform float uMaxRange;

uniform float uSaturation;
uniform float uLightness;

vec3 hsv2rgb(vec3 color) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(color.xxx + K.xyz) * 6.0 - K.www);
    return color.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), color.y);
}

float convertRange(vec2 origin, vec2 target, float value) {
    float ratio = (target.y - target.x) / (origin.y - origin.x);
    return (value - origin.x) * ratio + target.x;
}

void main() {
	vec3 color = hsv2rgb(vec3(convertRange(vec2(uMin, uMax), vec2(uMinRange, uMaxRange), uMagnitude), uSaturation, uLightness));
	gl_FragColor = vec4(color, 1.0);
}
