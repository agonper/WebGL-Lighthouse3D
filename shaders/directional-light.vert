attribute vec4 a_Position;
attribute vec3 a_Normal;
attribute vec2 a_TexCoord;

uniform mat4 u_MvpMatrix;
uniform vec4 u_Color;
uniform vec3 u_LightColor;
uniform vec3 u_LightDirection;
uniform vec3 u_AmbientLight;

varying vec4 v_Color;
varying vec2 v_TexCoord;
void main() {
	gl_Position = u_MvpMatrix * a_Position;
	vec3 normal = normalize(a_Normal);
	float nDotL = max(dot(u_LightDirection, normal), 0.0);
	vec3 diffuse = u_LightColor * vec3(u_Color) * nDotL;
	vec3 ambient = u_AmbientLight * u_Color.rgb;
	v_Color = vec4(diffuse + ambient, u_Color.a);
	v_TexCoord = a_TexCoord;
}
