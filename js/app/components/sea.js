/**
 * Created by Alberto on 09/01/2016.
 *
 * Sea component for the scene
 *
 * Characteristics:
 * - Specular lightning
 * - Varies on each frame rendered
 */
define([
    'initializers/webgl',
    'GLMatrix',
    'utils/program',
    'shader!sea.vert',
    'shader!sea.frag',
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

    function Sea(size) {
      this.camera = Camera.getInstance();
      this.textureStorage = TextureStorage.getInstance();

      this.program = new Program(vShader.value, fShader.value);

      this.seaSize = size;
      this.seaLevel = Sea.DEFAULT_LEVEL;

      var plane = new Plane(this.seaSize, this.seaSize, 128, 128);
      this.model = new Model(plane.vertices, plane.indices);
    }

    Sea.DEFAULT_LEVEL = 25.0;

    Sea.prototype = {
      draw: function() {
        this.program.enable();

        // Textures
        var normals = this.textureStorage.retrieveTexture('sea/normals.jpg');
        this.model.addTexture(this.program, normals);

        // mvpMatrix
        var viewMatrix = this.camera.getViewMatrix();
        var projMatrix = this.camera.getProjectionMatrix();
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [0.0, this.seaLevel, 0.0]);
        var mvpMatrix = mat4.create();
        mat4.multiply(mvpMatrix, projMatrix, viewMatrix);
        mat4.multiply(mvpMatrix, mvpMatrix, modelMatrix);

        var modelMatrixLoc = this.program.getUniform('u_ModelMatrix');
        gl.uniformMatrix4fv(modelMatrixLoc, false, modelMatrix);

        // Eye
        var eye = this.program.getUniform('u_Eye');
        gl.uniform3fv(eye, this.camera.getObserverPosition());

        // Time
        var time = this.program.getUniform('u_Time');
        gl.uniform1f(time, Date.now());

        // Lights
        AmbientLight.getInstance().addToObject(this.program);
        SunLight.getInstance().addToObject(this.program);

        // Fog
        Fog.getInstance().addToObject(this.program);

        var attributes = { size: 8, texCoords: { position: 6 } };

        gl.depthMask(false);
        this.model.draw(this.program, mvpMatrix, attributes);
        gl.depthMask(true);
      }
    };

    return Sea;
  });