/**
 * Created by Alberto on 03/01/2016.
 */
define(function () {
  function Plane(sx, sz, nx, nz) {

    var vertices = [];
    var indices = [];

    for(var j = 0; j <= nz; j++) {
      for(var i = 0; i <= nx; i++) {
        vertices.push(-sx/2 + i*sx/nx, 0, sz/2 - j*sz/nz); // Vertex coord
        vertices.push(0, 1, 0); // Vertex normal
        vertices.push(i/nx, j/nz); // Vertex texture coordinate
      }
    }

    for (var  j= 0; j < nz; j++) {
      for (var i = 0; i < nx; i++) {
        var n = j * (nx + 1) + i;
        indices.push(n, n + 1, n + nx + 1);
        indices.push(n + 1, n + nx + 1, n + nx + 2)
      }
    }

    return {
      vertices: vertices,
      indices: indices
    }
  }

  return Plane;
});