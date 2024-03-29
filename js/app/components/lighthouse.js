/**
 * Created by Alberto on 08/01/2016.
 *
 * Main scene component all surrounds the lighthouse.
 *
 * Characteristics:
 * - Shininess
 * - Rotating torch
 * - Rotating torchlight
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
  'utils/trigonometry',
  'utils/colors'
],
  function (webgl, GLMatrix, Program, vShader, fShader, Model, lighthouse, sphere, Camera, AmbientLight, SunLight, Fog, Trigonometry, Colors) {
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

      this.torchScale = 3.5;
      this.torchPosition = vec3.fromValues(0.0, 132.16, 0.0);

      this.torchLightPosition = vec3.fromValues(7.0, 0.0, 0.0);
      this.torchLightAzimuth = 0.0;
      this.torchLightColor = Lighthouse.DEFAULT_TORCH_COLOR;
      this.torchLightColorTemperature = Lighthouse.DEFAULT_TORCH_TEMPERATURE;

      this.shininess = Lighthouse.DEFAULT_SHININESS;
      this.specularColor = Lighthouse.DEFAULT_SPECULAR_COLOR;

      this.lastCall = Date.now();
      this.auto = true;

      // Lighthouse controls
      var _this = this;
      _this.torchControlSwitch = document.getElementById('toggle-torch-mode');
      _this.torchControlSwitch.addEventListener('click', function() {
        _this.switchAutoManual(_this);
      });

      var temperatureRange = document.getElementById('torchlight-temperature-control');
      temperatureRange.addEventListener('input', function() {
        _this.torchLightColorTemperature= temperatureRange.value;
        _this.torchLightColor = Colors.kelvinToRGB(_this.torchLightColorTemperature);
      });
    }

    Lighthouse.DEFAULT_POSITION = vec3.fromValues(-66.1, 46.32, 89.51);
    Lighthouse.DEFAULT_SCALE = 14;
    Lighthouse.DEFAULT_SHININESS = 40.0;
    Lighthouse.DEFAULT_SPECULAR_COLOR = vec3.fromValues(0.68, 0.73, 0.78);
    Lighthouse.DEFAULT_TORCH_TEMPERATURE = 3500;
    Lighthouse.DEFAULT_TORCH_COLOR = Colors.kelvinToRGB(Lighthouse.DEFAULT_TORCH_TEMPERATURE);
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
        var modelLighthouseMatrix = null;
        var modelTorchMatrix = null;
        var torchLightMatrix = null;

        //    Model matrix
        modelLighthouseMatrix = mat4.create();
        mat4.translate(modelLighthouseMatrix, modelLighthouseMatrix, this.lighthousePosition);
        modelTorchMatrix = mat4.clone(modelLighthouseMatrix); // Torch origin -> LightHouse
        mat4.scale(modelLighthouseMatrix, modelLighthouseMatrix, [this.lighthouseScale, this.lighthouseScale, this.lighthouseScale]);

        //    Normal matrix
        var normalLighthouseMatrix = mat4.create();
        mat4.invert(normalLighthouseMatrix, modelLighthouseMatrix);
        mat4.transpose(normalLighthouseMatrix, normalLighthouseMatrix);

        // Torch

        //    Model matrix
        mat4.translate(modelTorchMatrix, modelTorchMatrix, this.torchPosition);
        torchLightMatrix = mat4.clone(modelTorchMatrix); // Torch light origin -> Torch
        mat4.rotateY(modelTorchMatrix, modelTorchMatrix, this.torchLightAzimuth);
        mat4.scale(modelTorchMatrix, modelTorchMatrix, [this.torchScale, this.torchScale, this.torchScale]);

        //    Normal matrix
        var normalTorchMatrix = mat4.create();
        mat4.invert(normalTorchMatrix, modelTorchMatrix);
        mat4.transpose(normalTorchMatrix, normalTorchMatrix);

        // Torch light

        var lightPosition = this.program.getUniform('u_PointLightPosition');
        var lightColor = this.program.getUniform('u_PointLightColor');
        mat4.rotateY(torchLightMatrix, torchLightMatrix, this.torchLightAzimuth);
        var torchLightPosition = vec3.create();
        vec3.transformMat4(torchLightPosition, this.torchLightPosition, torchLightMatrix);
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
      switchAutoManual: function(context) {
        var lightouseControls = document.getElementById('lighthouse-controls');
        if (context.auto) {
          lightouseControls.innerHTML = '' +
            '<hr>' +
            '<label>' +
            'Rotation angle (0 - 360): ' +
            '<input id="torchlight-azimuth-control" type="range" value="' + Trigonometry.radiansToDegrees(context.torchLightAzimuth) + '" min="0" max="360">' +
            '</label>';

          context.torchControlSwitch.innerHTML = 'Auto rotation';
          var angleRange = document.getElementById('torchlight-azimuth-control');
          angleRange.addEventListener('input', function() {
            context.torchLightAzimuth = Trigonometry.degreesToRadians(angleRange.value);
          });
        } else {
          lightouseControls.innerHTML = '';
          context.torchControlSwitch.innerHTML = 'Manual rotation';
        }
        context.auto = !context.auto;
      },
      animate: function() {
        var now = Date.now();
        var elapsed = now - this.lastCall;
        this.lastCall = now;
        if (this.auto) {
          this.torchLightAzimuth = (this.torchLightAzimuth + Lighthouse.DEFAULT_ANGLE_STEP * elapsed / 1000.0)
            % Trigonometry.degreesToRadians(360);
        }

        var lighthouseInfo = document.getElementById('lighthouse-info');
        lighthouseInfo.innerHTML = '' +
          '<b>Torch color temperature: </b><ul>' +
          '<li>' + this.torchLightColorTemperature + 'k</li>'+
          '</ul>' +
          '<b>Torch azimuth: </b><ul>' +
          '<li>'+ Math.round(Trigonometry.radiansToDegrees(this.torchLightAzimuth)*100)/100 + 'º</li>' +
          '</ul>';
      }
    };

    return Lighthouse;
});