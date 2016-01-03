/**
 * Created by Alberto on 31/12/2015.
 */
define(['initializers/webgl', 'GLMatrix'], function (webgl, GLMatrix) {
  var vec3 = GLMatrix.vec3;
  var vec4 = GLMatrix.vec4;

  var gl = webgl.getContext();

  function Model(vertices, indices) {

    this.vertices = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    this.indices = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    this.numIndices = indices.length;

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  Model.prototype = {
    draw: function(program, mvpMat, color) {

      program.enable();

      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices);

      // Model elements properties

      var position = program.getAttribute('a_Position');
      var normal = program.getAttribute('a_Normal');
      var texCoord = program.getAttribute('a_TexCoord');

      gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 4*8, 0);
      gl.enableVertexAttribArray(position);

      gl.vertexAttribPointer(normal, 3, gl.FLOAT, false, 4*8, 4*3);
      gl.enableVertexAttribArray(normal);

      gl.vertexAttribPointer(texCoord, 2, gl.FLOAT, false, 4*8, 4*6);
      gl.enableVertexAttribArray(texCoord);

      // Model transformations

      var mvpMatrix = program.getUniform('u_MvpMatrix');
      gl.uniformMatrix4fv(mvpMatrix, false, mvpMat);

      // Light

      var lightColor = program.getUniform('u_LightColor');
      var lightDirection = program.getUniform('u_LightDirection');
      var ambientLight = program.getUniform('u_AmbientLight');

      gl.uniform3fv(lightColor, vec3.fromValues(1.0, 1.0, 1.0));

      var lightDir = vec3.fromValues(0.5, 3.0, 4.0);
      vec3.normalize(lightDir, lightDir);
      gl.uniform3fv(lightDirection, lightDir);

      gl.uniform3fv(ambientLight, vec3.fromValues(0.2, 0.2, 0.2));

      // Model color

      var col = program.getUniform('u_Color');
      if (color) {
        gl.uniform4fv(col, vec4.fromValues(color[0], color[1], color[2], color[3]));
      } else {
        gl.uniform4fv(col, vec4.fromValues(1.0, 1.0, 1.0, 1.0));
      }

      // Draw

      gl.drawElements(gl.TRIANGLES, this.numIndices, gl.UNSIGNED_SHORT, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
  };

  return Model;
});