function MeshLoader(gl)
{
  this.gl = gl;
}

MeshLoader.prototype.loadMesh = function(mesh)
{
  const gl = this.gl;
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.verts), gl.STATIC_DRAW);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.tris), gl.STATIC_DRAW);

  const textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.uvs), gl.STATIC_DRAW);

  return {
    verts: positionBuffer,
    numVerts: mesh.verts.length,
    tris: indexBuffer,
    numTris: mesh.tris.length,
    uvs: textureCoordBuffer,
  };
};

export {MeshLoader as default};
