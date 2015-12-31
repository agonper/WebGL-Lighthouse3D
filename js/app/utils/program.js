/**
 * Created by Alberto on 30/12/2015.
 *
 * Program class.
 *
 * Loads, stores and manages a determinate program.
 */
define(['initializers/webgl'], function (webgl) {
  var gl = webgl.getContext();

  function Program(vertexShader, fragmentShader) {
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;
    this.initialize();
  }

  Program.prototype = {
    program: null,
    initialize: function() {
      this.program = createProgram(this.vertexShader, this.fragmentShader);
      if (!this.program) {
        throw new Error('WebGL: Program creation failed');
      }
    },
    enable: function() {
      gl.useProgram(this.program);
    },
    getAttribute: function(name) {
      var attribute = gl.getAttribLocation(this.program, name);
      if (attribute < 0) {
        throw new Error('WebGL: Attribute not found: ' + name);
      }
      return attribute;
    },
    getUniform: function(name) {
      var uniform = gl.getUniformLocation(this.program, name);
      if (!uniform) {
        throw new Error('WebGL: Uniform not found: ' + name);
      }
      return uniform;
    }
  };

  /*
     #####################################
                 Util functions
     #####################################
   */

  function createProgram(vShader, fShader) {
    // Create shader object
    var vertexShader = loadShader(gl.VERTEX_SHADER, vShader);
    var fragmentShader = loadShader(gl.FRAGMENT_SHADER, fShader);
    if (!vertexShader || !fragmentShader) {
      return null;
    }

    // Create a program object
    var program = gl.createProgram();
    if (!program) {
      return null;
    }

    // Attach the shader objects
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    // Link the program object
    gl.linkProgram(program);

    // Check the result of linking
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
      var error = gl.getProgramInfoLog(program);
      console.log('Failed to link program: ' + error);
      gl.deleteProgram(program);
      gl.deleteShader(fragmentShader);
      gl.deleteShader(vertexShader);
      return null;
    }
    return program;
  }

  function loadShader(type, source) {
    // Create shader object
    var shader = gl.createShader(type);
    if (shader == null) {
      console.log('unable to create shader');
      return null;
    }

    // Set the shader program
    gl.shaderSource(shader, source);

    // Compile the shader
    gl.compileShader(shader);

    // Check the result of compilation
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
      var error = gl.getShaderInfoLog(shader);
      console.log('Failed to compile shader: ' + error);
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  return Program
});