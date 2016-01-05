precision mediump float;

uniform vec3 u_LightColor;
uniform vec3 u_LightDirection;
uniform vec3 u_AmbientLight;

uniform sampler2D u_Sampler0;
uniform sampler2D u_Sampler1;

varying vec2 v_TexCoord;

void main() {
	vec4 texColor = texture2D(u_Sampler0, v_TexCoord);

	vec3 normal = normalize(2.0 * (texture2D(u_Sampler1, v_TexCoord).rgb - 0.5));
	float nDotL = max(dot(u_LightDirection, normal), 0.0);

	vec3 diffuse = u_LightColor * texColor.rgb * nDotL;
	vec3 ambient = u_AmbientLight * texColor.rbg;

    gl_FragColor = vec4(diffuse + ambient, texColor.a);
}
