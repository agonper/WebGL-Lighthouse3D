attribute vec4 a_Position;
attribute vec3 a_Normal;
attribute vec4 a_Color;

uniform mat4 u_MvpMatrix;
uniform mat4 u_NormalMatrix;

varying vec4 v_Color;
varying vec3 v_Normal;
varying float v_Dist;
void main() {
	gl_Position = u_MvpMatrix * a_Position;
	v_Color = a_Color;
    v_Normal = normalize(vec3(u_NormalMatrix * vec4(a_Normal, 1.0)));
    v_Dist = gl_Position.w;
}