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
    draw: function(program, mvpMat, attributes) {

      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices);

      // Model attributes
      var position = program.getAttribute('a_Position');
      gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 4 * attributes.size, 0);
      gl.enableVertexAttribArray(position);

      if (attributes.normals) {
        var normal = program.getAttribute('a_Normal');
        gl.vertexAttribPointer(normal, 3, gl.FLOAT, false, 4 * attributes.size, 4 * attributes.normals.position);
        gl.enableVertexAttribArray(normal);
      }

      if (attributes.colors) {
        var color = program.getAttribute('a_Color');
        gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 4 * attributes.size, 4 * attributes.colors.position);
        gl.enableVertexAttribArray(color);
      }

      if (attributes.texCoords) {
        var texCoord = program.getAttribute('a_TexCoord');
        gl.vertexAttribPointer(texCoord, 2, gl.FLOAT, false, 4 * attributes.size, 4 * attributes.texCoords.position);
        gl.enableVertexAttribArray(texCoord);
      }

      // Model transformations
      var mvpMatrix = program.getUniform('u_MvpMatrix');
      gl.uniformMatrix4fv(mvpMatrix, false, mvpMat);

      // Draw

      gl.drawElements(gl.TRIANGLES, this.numIndices, gl.UNSIGNED_SHORT, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    },
    addTexture: function(program, texture) {
      gl.activeTexture(gl.TEXTURE0 + texture.texUnit);
      gl.bindTexture(gl.TEXTURE_2D, texture.texture);
      var sampler = program.getUniform('u_Sampler' + texture.texUnit);
      gl.uniform1i(sampler, texture.texUnit);
    }
  };

  return Model;
});