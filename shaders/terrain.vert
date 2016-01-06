attribute vec4 a_Position;
attribute vec2 a_TexCoord;

uniform mat4 u_MvpMatrix;
uniform vec3 u_Eye;
uniform vec4 u_Color;

uniform sampler2D u_Sampler2;
uniform float u_HeightRatio;

varying vec2 v_TexCoord;
varying float v_Dist;
void main() {
    vec4 height = texture2D(u_Sampler2, a_TexCoord);
	gl_Position = u_MvpMatrix * vec4(a_Position.x, a_Position.y + u_HeightRatio * height.r, a_Position.z, a_Position.w);

	v_TexCoord = a_TexCoord;
	v_Dist = distance(a_Position, vec4(u_Eye, 1.0));
}
