/**
 * Created by Alberto on 08/01/2016.
 */
define([
  'initializers/webgl',
  'GLMatrix',
  'utils/program',
  'shader!lighthouse.vert',
  'shader!lighthouse.frag',
  'utils/model',
  'models/lighthouse',
  'models/sphere',
  'components/camera',
  'components/ambient-light',
  'components/sun-light',
  'components/fog',
  'utils/trigonometry'
],
  function (webgl, GLMatrix, Program, vShader, fShader, Model, lighthouse, sphere, Camera, AmbientLight, SunLight, Fog, Trigonometry) {
    var gl = webgl.getContext();
    var mat4 = GLMatrix.mat4;
    var vec3 = GLMatrix.vec3;

    function Lighthouse() {
      this.camera = Camera.getInstance();
      this.program = new Program(vShader.value, fShader.value);
      this.lighthouseModel = new Model(lighthouse.vertices, lighthouse.indices);
      this.torchModel = new Model(sphere.vertices, sphere.indices);

      this.lighthouseScale = Lighthouse.DEFAULT_SCALE;
      this.lighthousePosition = Lighthouse.DEFAULT_POSITION;

      this.torchScale = 0.25;
      this.torchPosition = vec3.fromValues(0.0, 9.44, 0.0);

      this.torchLightPosition = vec3.fromValues(4.0, 0.0, 0.0);
      this.torchLightAzimuth = Trigonometry.degreesToRadians(0);
      this.torchLightColor = Lighthouse.DEFAULT_TORCH_COLOR;

      this.shininess = Lighthouse.DEFAULT_SHININESS;
      this.specularColor = Lighthouse.DEFAULT_SPECULAR_COLOR;

      this.lastCall = Date.now();
    }

    Lighthouse.DEFAULT_POSITION = vec3.fromValues(-66.1, 46.32, 89.51);
    Lighthouse.DEFAULT_SCALE = 14;
    Lighthouse.DEFAULT_SHININESS = 40.0;
    Lighthouse.DEFAULT_SPECULAR_COLOR = vec3.fromValues(0.68, 0.73, 0.78);
    Lighthouse.DEFAULT_TORCH_COLOR = vec3.fromValues(1.0, 0.77, 0.05);
    Lighthouse.DEFAULT_ANGLE_STEP = Trigonometry.degreesToRadians(55.0);


    Lighthouse.prototype = {
      draw: function() {
        this.program.enable();

        // Eye
        var eye = this.program.getUniform('u_Eye');
        gl.uniform3fv(eye, this.camera.getObserverPosition());

        // Lights
        AmbientLight.getInstance().addToObject(this.program);
        SunLight.getInstance().addToObject(this.program);

        // Shininess
        var shininess = this.program.getUniform('u_Shininess');
        gl.uniform1f(shininess, this.shininess);
        var specularColor = this.program.getUniform('u_SpecularColor');
        gl.uniform3fv(specularColor, this.specularColor);

        // Fog
        Fog.getInstance().addToObject(this.program);

        // mvpMatrix
        var viewMatrix = this.camera.getViewMatrix();
        var projMatrix = this.camera.getProjectionMatrix();

        var vpMatrix = mat4.create();
        mat4.multiply(vpMatrix, projMatrix, viewMatrix);
        var mvpMatrix = mat4.create();

        var normalMatLoc = this.program.getUniform('u_NormalMatrix');
        var modelMatLoc = this.program.getUniform('u_ModelMatrix');

        // Lighthouse

        //    Model matrix
        var modelLighthouseMatrix = mat4.create();
        mat4.translate(modelLighthouseMatrix, modelLighthouseMatrix, this.lighthousePosition);
        mat4.scale(modelLighthouseMatrix, modelLighthouseMatrix, [this.lighthouseScale, this.lighthouseScale, this.lighthouseScale]);

        //    Normal matrix
        var normalLighthouseMatrix = mat4.create();
        mat4.invert(normalLighthouseMatrix, modelLighthouseMatrix);
        mat4.transpose(normalLighthouseMatrix, normalLighthouseMatrix);

        // Torch

        //    Model matrix
        var modelTorchMatrix = mat4.clone(modelLighthouseMatrix);
        mat4.translate(modelTorchMatrix, modelTorchMatrix, this.torchPosition);
        mat4.scale(modelTorchMatrix, modelTorchMatrix, [this.torchScale, this.torchScale, this.torchScale]);

        //    Normal matrix
        var normalTorchMatrix = mat4.create();
        mat4.invert(normalTorchMatrix, modelTorchMatrix);
        mat4.transpose(normalTorchMatrix, normalTorchMatrix);

        // Torch light

        var lightPosition = this.program.getUniform('u_PointLightPosition');
        var lightColor = this.program.getUniform('u_PointLightColor');
        var transformationMatrix = mat4.clone(modelTorchMatrix);
        mat4.rotateY(transformationMatrix, transformationMatrix, this.torchLightAzimuth);
        var torchLightPosition = vec3.create();
        vec3.transformMat4(torchLightPosition, this.torchLightPosition, transformationMatrix);
        gl.uniform3fv(lightPosition, torchLightPosition);
        gl.uniform3fv(lightColor, this.torchLightColor);

        // Draw
        mat4.multiply(mvpMatrix, vpMatrix, modelLighthouseMatrix);
        gl.uniformMatrix4fv(modelMatLoc, false, modelLighthouseMatrix);
        gl.uniformMatrix4fv(normalMatLoc, false, normalLighthouseMatrix);
        var attributes = { size: 9, normals: { position: 3 }, colors: { position: 6 } };
        this.lighthouseModel.draw(this.program, mvpMatrix, attributes);

        mat4.multiply(mvpMatrix, vpMatrix, modelTorchMatrix);
        gl.uniformMatrix4fv(modelMatLoc, false, modelTorchMatrix);
        gl.uniformMatrix4fv(normalMatLoc, false, normalTorchMatrix);
        attributes = { size: 8, normals: { position: 3 } };
        this.torchModel.draw(this.program, mvpMatrix, attributes);
      },
      animate: function() {
        var now = Date.now();
        var elapsed = now - this.lastCall;
        this.lastCall = now;
        this.torchLightAzimuth = (this.torchLightAzimuth + Lighthouse.DEFAULT_ANGLE_STEP * elapsed / 1000.0)
          % Trigonometry.degreesToRadians(360);
      }
    };

    return Lighthouse;
});