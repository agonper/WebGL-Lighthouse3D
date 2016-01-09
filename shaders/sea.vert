attribute vec4 a_Position;
attribute vec2 a_TexCoord;

uniform mat4 u_MvpMatrix;
uniform mat4 u_ModelMatrix;

varying vec3 v_Position;
varying vec2 v_TexCoord;
varying float v_Dist;

void main() {
    gl_Position = u_MvpMatrix * a_Position;
    v_Position = vec3(u_ModelMatrix * a_Position);
    v_Dist = gl_Position.w;
    v_TexCoord = a_TexCoord;
}