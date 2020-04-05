function Mesh(verts, tris, uvs, texture)
{
  this.verts = verts;
  this.tris = tris;
  this.uvs = uvs;
  this.texture = texture;
}

// Adds another mesh to this mesg
Mesh.prototype.addMesh = function(mesh)
{
  const baseIdx = this.verts.length / 3;

  this.verts = this.verts.concat(mesh.verts);
  this.uvs = this.uvs.concat(mesh.uvs);

  for (const tri of mesh.tris)
  {
    this.tris.push(tri + baseIdx);
  }
};

// Moves all vertices by the specified amount
Mesh.prototype.translate = function(x, y, z)
{
  for (let i = 0; i < this.verts.length; i += 3)
  {
    this.verts[i] += x;
    this.verts[i + 1] += y;
    this.verts[i + 2] += z;
  }
};

export {Mesh as default};
