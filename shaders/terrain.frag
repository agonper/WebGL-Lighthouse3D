precision mediump float;

uniform sampler2D u_Sampler0;
uniform sampler2D u_Sampler1;

varying vec4 v_Color;
varying vec2 v_TexCoord;

void main() {
    vec4 color = v_Color;
	vec4 normal = texture2D(u_Sampler1, v_TexCoord);
	vec4 tex = texture2D(u_Sampler0, v_TexCoord);
    gl_FragColor = texture2D(u_Sampler0, v_TexCoord);

}
