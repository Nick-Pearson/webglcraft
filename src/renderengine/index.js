function RenderEngine(gl, camera)
{
  console.log('Initialising RenderEngine');
  this.gl = gl;
  this.renderables = [];
  this.projectionMatrix = createProjectionMatrix(gl, camera.fov);
  this.camera = camera;

  initGL(gl);
}

function initGL(gl)
{
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clearColor(0.0, 0.0, 0.2, 1.0);
  gl.clearDepth(1.0);
}

function createProjectionMatrix(gl, fov)
{
  const fieldOfView = fov * Math.PI / 180;
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.001;
  const zFar = 8000.0;
  const projectionMatrix = mat4.create();

  mat4.perspective(projectionMatrix,
      fieldOfView,
      aspect,
      zNear,
      zFar);

  return projectionMatrix;
}

RenderEngine.prototype.drawScene = function()
{
  const gl = this.gl;
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  this.renderables.forEach((renderable) =>
  {
    this.draw(renderable);
  });
};

RenderEngine.prototype.draw = function(renderable)
{
  const gl = this.gl;

  const modelViewMatrix = mat4.create();

  const b = quat.create();
  quat.normalize(b, this.camera.getRotation());

  const a = mat4.create();
  mat4.fromQuat(a, b);
  mat4.multiply(modelViewMatrix,
      modelViewMatrix,
      a);

  mat4.invert(modelViewMatrix, modelViewMatrix);

  mat4.translate(modelViewMatrix,
      modelViewMatrix,
      this.camera.getPosition());

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  {
    const numComponents = 3; // pull out 2 values per iteration
    const type = gl.FLOAT; // the data in the buffer is 32bit floats
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0; // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, renderable.mesh.verts);
    gl.vertexAttribPointer(
        renderable.shader.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        renderable.shader.attribLocations.vertexPosition);
  }

  {
    // Tell WebGL which indices to use to index the vertices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, renderable.mesh.tris);
  }

  // tell webgl how to pull out the texture coordinates from buffer
  {
    const num = 2; // every coordinate composed of 2 values
    const type = gl.FLOAT; // the data in the buffer is 32 bit float
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set to the next
    const offset = 0; // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, renderable.mesh.uvs);
    gl.vertexAttribPointer(renderable.shader.attribLocations.textureCoord, num, type, normalize, stride, offset);
    gl.enableVertexAttribArray(renderable.shader.attribLocations.textureCoord);
  }

  // Tell WebGL to use our program when drawing
  gl.useProgram(renderable.shader.program);

  // Tell WebGL we want to affect texture unit 0
  gl.activeTexture(gl.TEXTURE0);

  // Bind the texture to texture unit 0
  gl.bindTexture(gl.TEXTURE_2D, renderable.mesh.texture);

  // Tell the shader we bound the texture to texture unit 0
  gl.uniform1i(renderable.shader.uniformLocations.uSampler, 0);

  // Set the shader uniforms
  gl.uniformMatrix4fv(
      renderable.shader.uniformLocations.projectionMatrix,
      false,
      this.projectionMatrix);
  gl.uniformMatrix4fv(
      renderable.shader.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);

  {
    const vertexCount = renderable.mesh.numTris;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }
};

RenderEngine.prototype.addObject = function(mesh, shader)
{
  this.renderables.push({
    mesh: mesh,
    shader: shader,
  });
};

export {RenderEngine as default};
