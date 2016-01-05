precision mediump float;

uniform vec3 u_LightColor;
uniform vec3 u_LightDirection;
uniform vec3 u_AmbientLight;

uniform vec3 u_FogColor;
uniform vec2 u_FogDist;

uniform sampler2D u_Sampler0;
uniform sampler2D u_Sampler1;

varying vec2 v_TexCoord;
varying float v_Dist;
void main() {
	vec4 texColor = texture2D(u_Sampler0, v_TexCoord);

	vec3 normal = normalize(2.0 * (texture2D(u_Sampler1, v_TexCoord).rgb - 0.5));
	float nDotL = max(dot(u_LightDirection, normal), 0.0);

	vec3 diffuse = u_LightColor * texColor.rgb * nDotL;
	vec3 ambient = u_AmbientLight * texColor.rbg;
    vec3 lightedColor = diffuse + ambient;

	float fogFactor = clamp((u_FogDist.y - v_Dist) / (u_FogDist.y - u_FogDist.x), 0.0, 1.0);
    vec3 color = mix(u_FogColor, lightedColor, fogFactor);

    gl_FragColor = vec4(color, texColor.a);
}
