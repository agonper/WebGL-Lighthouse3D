/**
 * Created by Alberto on 04/01/2016.
 *
 * Scene terrain for representing all the scene objects on the top of it
 *
 * Terrain textures generated with the tool L3DT:
 * - Terrain texture
 * - Terrain heightmap, a greyscale image in which each point represents the height for that point on the terrain
 * scale 1:10 (10 Horizontal units: 1 Vertical unit)
 * - Terrain normals for the illumination
 *
 */
define([
  'initializers/webgl',
  'GLMatrix',
  'utils/program',
  'shader!terrain.vert',
  'shader!terrain.frag',
  'utils/model',
  'models/plane',
  'components/camera',
  'utils/texture-storage',
  'components/ambient-light',
  'components/sun-light',
  'components/fog'
],
  function (webgl, GLMatrix, Program, vShader, fShader, Model, Plane, Camera, TextureStorage, AmbientLight, SunLight, Fog) {
    var gl = webgl.getContext();
    var mat4 = GLMatrix.mat4;

    function Terrain(size) {
      this.camera = Camera.getInstance();
      this.textureStorage = TextureStorage.getInstance();

      this.program = new Program(vShader.value, fShader.value);

      this.terrainSize = size;
      var plane = new Plane(this.terrainSize, this.terrainSize, 128, 128);
      this.model = new Model(plane.vertices, plane.indices);
    }

    Terrain.prototype = {
      draw: function() {
        this.program.enable();

        // Textures
        var texture = this.textureStorage.retrieveTexture('terrain/texture.png');
        var normals = this.textureStorage.retrieveTexture('terrain/normals.png');
        var heightmap = this.textureStorage.retrieveTexture('terrain/heightmap.png');

        this.model.addTexture(this.program, texture);
        this.model.addTexture(this.program, normals);
        this.model.addTexture(this.program, heightmap);

        // Y axis displacement
        var heightRatio = this.program.getUniform('u_HeightRatio');
        gl.uniform1f(heightRatio, this.terrainSize/10.0);

        // mvpMatrix
        var viewMatrix = this.camera.getViewMatrix();
        var projMatrix = this.camera.getProjectionMatrix();

        var mvpMatrix = mat4.create();
        mat4.multiply(mvpMatrix, projMatrix, viewMatrix);

        // Eye
        var eye = this.program.getUniform('u_Eye');
        gl.uniform3fv(eye, this.camera.getObserverPosition());

        // Lights
        AmbientLight.getInstance().addToObject(this.program);
        SunLight.getInstance().addToObject(this.program);

        // Fog
        Fog.getInstance().addToObject(this.program);

        var attributes = { size: 8, texCoords: { position: 6 } };
        this.model.draw(this.program, mvpMatrix, attributes);
      }
    };

    return Terrain;
});