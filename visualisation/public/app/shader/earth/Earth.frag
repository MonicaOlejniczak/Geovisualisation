uniform sampler2D uTexture;
uniform vec3 uColor;
uniform float uSurfacePosition;

uniform float uHue;
uniform float uSaturation;
uniform float uValue;

uniform float uRedShift;
uniform float uGreenShift;
uniform float uBlueShift;

varying vec2 vUv;
varying vec3 vPosition;

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

void main() {
	if (vPosition.y < uSurfacePosition) {
		gl_FragColor = vec4(uColor, 1.0);
	} else {

	    vec3 originalColor = texture2D(uTexture, vUv).rgb;

	    vec2 originalColorRange = vec2(-100.0, 100.0);
	    vec2 rgbColorRange = vec2(0.0, 255.0);
	    vec2 finalColorRange = vec2(0.0, 1.0);

	    float redShift = convertRange(originalColorRange, rgbColorRange, uRedShift);
	    float greenShift = convertRange(originalColorRange, rgbColorRange, uGreenShift);
	    float blueShift = convertRange(originalColorRange, rgbColorRange, uBlueShift);

	    vec3 colorShift = vec3(redShift, greenShift, blueShift);
	    vec3 colorBalance = colorShift / rgbColorRange.y;

    	vec3 color = hsv2rgb(rgb2hsv(colorBalance * originalColor) * vec3(uHue, uSaturation, uValue));
//    	color *= mat3(
//    	    0.60974, 0.31111, 0.01947,
//    	    0.20528, 0.62567, 0.06087,
//    	    0.14919, 0.06322, 0.74457
//    	);

		gl_FragColor = vec4(color, 1.0);
	}
}
