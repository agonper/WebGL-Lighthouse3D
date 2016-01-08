(function (fileName) {
  var indices = null;
  var vertices = null;

  var rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType('application/json');
  rawFile.open('GET', fileName, true);
  rawFile.onload = function() {
    var model = JSON.parse(rawFile.responseText);
    indices = model.connectivity[0].indices;
    vertices = [];
    var verticesTri = [];
    var normals = [];
    var colors = [];

    for (var i = 0; i < model.vertices[0].values.length; i += 3) {
      verticesTri.push([model.vertices[0].values[i], model.vertices[0].values[i+1], model.vertices[0].values[i+2]]);
    }

    for (var i = 0; i < model.vertices[1].values.length; i+= 3) {
      normals.push([model.vertices[1].values[i], model.vertices[1].values[i+1], model.vertices[1].values[i+2]]);
    }

    for (var i = 0; i < model.vertices[2].values.length; i+=4) {
      colors.push([model.vertices[2].values[i], model.vertices[2].values[i+1], model.vertices[2].values[i+2]]);
    }

    for (var i = 0; i < verticesTri.length; i++) {
      vertices.push(verticesTri[i][0], verticesTri[i][1], verticesTri[i][2]);
      vertices.push(normals[i][0], normals[i][1], normals[i][2]);
      vertices.push(colors[i][0]/255, colors[i][1]/255, colors[i][2]/255);
    }

    console.log('Vertices:', vertices);
    console.log('Indices:', indices);
    console.log('OK');
  };
  rawFile.send();
})('models/Lighthouse.json');
