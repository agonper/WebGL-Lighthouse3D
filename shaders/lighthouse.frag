precision mediump float;

uniform vec3 u_PointLightPosition;
uniform vec3 u_PointLightColor;

uniform vec3 u_LightColor;
uniform vec3 u_LightDirection;
uniform vec3 u_AmbientLight;
uniform float u_Shininess;
uniform vec3 u_SpecularColor;

uniform vec3 u_FogColor;
uniform vec2 u_FogDist;

uniform vec3 u_Eye;

varying vec4 v_Color;
varying vec3 v_Normal;
varying float v_Dist;
varying vec3 v_Position;
void main() {
    float nDotL = max(dot(v_Normal, -u_LightDirection), 0.0);
    vec3 eyeFocus = normalize(u_Eye);
    vec3 reflection = reflect(u_LightDirection, v_Normal);

    vec3 diffuse;
    if (v_Position.y > 173.0) {
        vec3 pointLightDirection = normalize(u_PointLightPosition - vec3(v_Position));
        float nDotPL = max(dot(pointLightDirection, v_Normal), 0.0);
        diffuse = u_LightColor * v_Color.rgb * nDotL + u_PointLightColor * v_Color.rgb * nDotPL;
    } else {
        diffuse = u_LightColor * v_Color.rgb * nDotL;
    }
    vec3 ambient = u_AmbientLight * v_Color.rgb;
    vec3 specular = u_SpecularColor * pow(max(dot(reflection, eyeFocus), 0.0), u_Shininess);
    vec3 lightedColor = diffuse + ambient + specular;

    float fogFactor = clamp((u_FogDist.y - v_Dist) / (u_FogDist.y - u_FogDist.x), 0.0, 1.0);
    vec3 color = mix(u_FogColor, lightedColor, fogFactor);

	gl_FragColor = vec4(color, v_Color.a);
}