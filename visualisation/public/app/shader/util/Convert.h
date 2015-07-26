vec3 rgb2hsv(vec3 color) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(color.bg, K.wz), vec4(color.gb, K.xy), step(color.b, color.g));
    vec4 q = mix(vec4(p.xyw, color.r), vec4(color.r, p.yzx), step(p.x, color.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 color) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(color.xxx + K.xyz) * 6.0 - K.www);
    return color.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), color.y);
}

float rgb2value(vec3 color) {
    return max(max(color.r, color.g), color.b);
}

float convertRange(vec2 origin, vec2 target, float value) {
    float ratio = (target.y - target.x) / (origin.y - origin.x);
    return (value - origin.x) * ratio + target.x;
}

vec3 convertRange(vec2 origin, vec2 target, vec3 value) {
 	return vec3(
 	    convertRange(origin, target, value.x),
 	    convertRange(origin, target, value.y),
 	    convertRange(origin, target, value.z)
    );
}