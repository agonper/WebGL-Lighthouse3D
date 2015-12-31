/**
 * Created by Alberto on 31/12/2015.
 */
define(['initializers/webgl'], function (webgl) {
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
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices);

      program.enable();

      var position = program.getAttribute('a_Position');
      var normal = program.getAttribute('a_Normal');
      var texCoord = program.getAttribute('a_TexCoord');

      gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 4*8, 0);
      gl.enableVertexAttribArray(position);

      gl.vertexAttribPointer(normal, 3, gl.FLOAT, false, 4*8, 4*3);
      gl.enableVertexAttribArray(normal);

      gl.vertexAttribPointer(texCoord, 2, gl.FLOAT, false, 4*8, 4*6);
      gl.enableVertexAttribArray(texCoord);

      var mvpMatrix = program.getUniform('u_MvpMatrix');
      gl.uniformMatrix4fv(mvpMatrix, false, mvpMat);

      var col = program.getUniform('u_Color');
      if (color) {
        gl.uniform3f(col, color[0], color[1], color[2]);
      } else {
        gl.uniform3f(col, 1.0, 1.0, 1.0);
      }

      gl.drawElements(gl.TRIANGLES, this.numIndices, gl.UNSIGNED_SHORT, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
  };

  return Model;
});