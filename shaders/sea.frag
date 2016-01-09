// Special thanks to http://29a.ch for the ideas about the water

precision mediump float;

uniform vec3 u_LightDirection;
uniform vec3 u_LightColor;
uniform vec3 u_AmbientLight;

uniform vec3 u_FogColor;
uniform vec2 u_FogDist;

uniform vec3 u_Eye;

uniform float u_Time;

uniform sampler2D u_Sampler0;

varying vec3 v_Position;
varying vec2 v_TexCoord;
varying float v_Dist;

vec4 getNoise(vec2 uv) {
    vec2 uv0 = (uv / 103.0) + vec2(u_Time / 17.0, u_Time / 29.0);
    vec2 uv1 = uv / 107.0 - vec2(u_Time / -19.0, u_Time / 31.0);
    vec2 uv2 = uv / vec2(897.0, 983.0) + vec2(u_Time / 101.0, u_Time / 97.0);
    vec2 uv3 = uv / vec2(991.0, 877.0) - vec2(u_Time / 109.0, u_Time / -113.0);
    vec4 noise = (texture2D(u_Sampler0, uv0)) +
                 (texture2D(u_Sampler0, uv1)) +
                 (texture2D(u_Sampler0, uv2)) +
                 (texture2D(u_Sampler0, uv3));
    return noise*0.5-1.0;
}

void sunLight(const vec3 surfaceNormal, const vec3 eyeDirection, float shiny, float spec, float diffuse,
              inout vec3 diffuseColor, inout vec3 specularColor) {
    vec3 reflection = normalize(reflect(-u_LightDirection, surfaceNormal));
    float direction = max(dot(eyeDirection, reflection), 0.0);
    specularColor += pow(direction, shiny)*u_LightColor*spec;
    diffuseColor += max(dot(u_LightDirection, surfaceNormal), 0.0)*u_LightColor*diffuse;
}

void main() {
	vec4 noise = getNoise(v_TexCoord.xy);
	vec3 surfaceNormal = normalize(noise.xyz * vec3(2.0, 1.0, 2.0));

	vec3 diffuse = vec3(0.0);
	vec3 specular = vec3(0.0);

	vec3 eyeDirection = normalize(u_Eye - v_Position);
	sunLight(surfaceNormal, eyeDirection, 100.0, 2.0, 0.5, diffuse, specular);

	float theta1 = max(dot(eyeDirection, surfaceNormal), 0.0);
	float rf0 = 0.05;
	float reflectance = rf0 + (1.0 - rf0) * pow((1.0 - theta1), 5.0);
	vec3 scatter = max(0.0, dot(surfaceNormal, eyeDirection))*vec3(0.0, 0.1, 0.07);

	vec3 lightedColor = mix(vec3(0.3, 0.5, 0.9) * diffuse * 0.3 + scatter, (u_AmbientLight + specular), reflectance);

	float fogFactor = clamp((u_FogDist.y - v_Dist) / (u_FogDist.y - u_FogDist.x), 0.0, 1.0);
	vec3 color = mix(u_FogColor, lightedColor, fogFactor);

	gl_FragColor = vec4(color, 1.0);
}
