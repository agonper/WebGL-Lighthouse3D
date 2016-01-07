precision mediump float;

uniform vec3 u_LightColor;
uniform vec3 u_LightDirection;
uniform vec3 u_AmbientLight;

uniform vec3 u_FogColor;
uniform vec2 u_FogDist;

varying vec4 v_Color;
varying vec3 v_Normal;
varying float v_Dist;
void main() {
    float nDotL = max(dot(u_LightDirection, v_Normal), 0.0);

    vec3 diffuse = u_LightColor * v_Color.rgb * nDotL;
    vec3 ambient = u_AmbientLight * v_Color.rgb;
    vec3 lightedColor = diffuse + ambient;

    float fogFactor = clamp((u_FogDist.y - v_Dist) / (u_FogDist.y - u_FogDist.x), 0.0, 1.0);
    vec3 color = mix(u_FogColor, lightedColor, fogFactor);

	gl_FragColor = vec4(color, v_Color.a);
}