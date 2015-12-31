/**
 * Created by Alberto on 30/12/2015.
 */
define(['utils/program', 'shader!directional-light.vert', 'shader!directional-light.frag'],
  function (Program, vShader, fShader) {

  var program = null;

  function getProgram() {
    if (!program) {
      program = new Program(vShader.value, fShader.value);
    }
    return program;
  }

  return getProgram();

});