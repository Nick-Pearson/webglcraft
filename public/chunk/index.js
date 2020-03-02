import Mesh from '../mesh/index.js';
import {getBlock} from '../block/index.js';

function ChunkMeshBuilder(textureLoader)
{
  this.textureLoader = textureLoader;
};

function buildTopMesh(x, y, z)
{
  const positions = [
    -0.5, 0.0, -0.5,
    -0.5, 0.0, 0.5,
    0.5, 0.0, 0.5,
    0.5, 0.0, -0.5,
  ];

  const indices = [
    0, 1, 2, 0, 2, 3,
  ];

  const textureCoordinates = [
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
  ];
  const mesh = new Mesh(positions, indices, textureCoordinates);
  mesh.translate(x, y, z);
  return mesh;
}

function buildBottomMesh(x, y, z)
{
  const positions = [
    -0.5, -1.0, -0.5,
    0.5, -1.0, -0.5,
    0.5, -1.0, 0.5,
    -0.5, -1.0, 0.5,
  ];

  const indices = [
    0, 1, 2, 0, 2, 3,
  ];

  const textureCoordinates = [
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
  ];
  const mesh = new Mesh(positions, indices, textureCoordinates);
  mesh.translate(x, y, z);
  return mesh;
}

function buildSidesMesh(x, y, z)
{
  const positions = [
    // Front face
    -0.5, -1.0, 0.5,
    0.5, -1.0, 0.5,
    0.5, 0.0, 0.5,
    -0.5, 0.0, 0.5,

    // Back face
    0.5, 0.0, -0.5,
    -0.5, 0.0, -0.5,
    -0.5, -1.0, -0.5,
    0.5, -1.0, -0.5,

    // Right face
    0.5, -1.0, -0.5,
    0.5, -1.0, 0.5,
    0.5, 0.0, 0.5,
    0.5, 0.0, -0.5,

    // Left face
    -0.5, -1.0, -0.5,
    -0.5, -1.0, 0.5,
    -0.5, 0.0, 0.5,
    -0.5, 0.0, -0.5,
  ];

  const indices = [
    0, 1, 2, 0, 2, 3, // front
    4, 5, 6, 4, 6, 7, // back
    8, 9, 10, 8, 10, 11, // right
    12, 13, 14, 12, 14, 15, // left
  ];

  const textureCoordinates = [
    // Front
    0.0, 1.0,
    1.0, 1.0,
    1.0, 0.0,
    0.0, 0.0,
    // Back
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    // Right
    0.0, 1.0,
    1.0, 1.0,
    1.0, 0.0,
    0.0, 0.0,
    // Left
    0.0, 1.0,
    1.0, 1.0,
    1.0, 0.0,
    0.0, 0.0,
  ];
  const mesh = new Mesh(positions, indices, textureCoordinates);
  mesh.translate(x, y, z);
  return mesh;
}

ChunkMeshBuilder.prototype.addSubmesh = function(texture, mesh, submeshes)
{
  const existingMesh = submeshes[texture];

  if (existingMesh !== undefined)
  {
    existingMesh.addMesh(mesh);
  }
  else
  {
    const glTexture = this.textureLoader.loadTexture(texture);
    mesh.texture = glTexture;
    submeshes[texture] = mesh;
  }
};

ChunkMeshBuilder.prototype.buildBlockMeshes = function(blockID, x, y, z, submeshes)
{
  const block = getBlock(blockID);

  this.addSubmesh(block.topTexture, buildTopMesh(x, y, z), submeshes);
  this.addSubmesh(block.bottomTexture, buildBottomMesh(x, y, z), submeshes);
  this.addSubmesh(block.sidesTexture, buildSidesMesh(x, y, z), submeshes);
};

ChunkMeshBuilder.prototype.buildChunkMeshes = function()
{
  const submeshes = {};

  for (let x = 0; x < 16; ++x)
  {
    for (let z = 0; z < 16; ++z)
    {
      this.buildBlockMeshes('grass_block', x, 0.0, z, submeshes);
    }
  }
  this.buildBlockMeshes('oak_log', 0.0, 1.0, 0.0, submeshes);
  this.buildBlockMeshes('oak_log', 0.0, 2.0, 0.0, submeshes);

  return Object.values(submeshes);
};

export {ChunkMeshBuilder as default};
