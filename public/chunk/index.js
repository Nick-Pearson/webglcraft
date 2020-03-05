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

function buildLeftMesh(x, y, z)
{
  const positions = [
    -0.5, -1.0, -0.5,
    -0.5, -1.0, 0.5,
    -0.5, 0.0, 0.5,
    -0.5, 0.0, -0.5,
  ];

  const indices = [
    0, 1, 2, 0, 2, 3,
  ];

  const textureCoordinates = [
    0.0, 1.0,
    1.0, 1.0,
    1.0, 0.0,
    0.0, 0.0,
  ];
  const mesh = new Mesh(positions, indices, textureCoordinates);
  mesh.translate(x, y, z);
  return mesh;
}

function buildRightMesh(x, y, z)
{
  const positions = [
    0.5, -1.0, -0.5,
    0.5, -1.0, 0.5,
    0.5, 0.0, 0.5,
    0.5, 0.0, -0.5,
  ];

  const indices = [
    0, 1, 2, 0, 2, 3,
  ];

  const textureCoordinates = [
    0.0, 1.0,
    1.0, 1.0,
    1.0, 0.0,
    0.0, 0.0,
  ];
  const mesh = new Mesh(positions, indices, textureCoordinates);
  mesh.translate(x, y, z);
  return mesh;
}

function buildFrontMesh(x, y, z)
{
  const positions = [
    -0.5, -1.0, 0.5,
    0.5, -1.0, 0.5,
    0.5, 0.0, 0.5,
    -0.5, 0.0, 0.5,
  ];

  const indices = [
    0, 1, 2, 0, 2, 3,
  ];

  const textureCoordinates = [
    0.0, 1.0,
    1.0, 1.0,
    1.0, 0.0,
    0.0, 0.0,
  ];
  const mesh = new Mesh(positions, indices, textureCoordinates);
  mesh.translate(x, y, z);
  return mesh;
}

function buildBackMesh(x, y, z)
{
  const positions = [
    0.5, 0.0, -0.5,
    -0.5, 0.0, -0.5,
    -0.5, -1.0, -0.5,
    0.5, -1.0, -0.5,
  ];

  const indices = [
    0, 1, 2, 0, 2, 3,
  ];

  const textureCoordinates = [
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

ChunkMeshBuilder.prototype.buildBlockMeshes = function(world, blockID, x, y, z, submeshes)
{
  const block = getBlock(blockID);

  if (!world.isOpaqueBlock(x, y + 1.0, z))
  {
    this.addSubmesh(block.topTexture, buildTopMesh(x, y, z), submeshes);
  }
  if (!world.isOpaqueBlock(x, y - 1.0, z))
  {
    this.addSubmesh(block.bottomTexture, buildBottomMesh(x, y, z), submeshes);
  }
  if (!world.isOpaqueBlock(x + 1.0, y, z))
  {
    this.addSubmesh(block.sidesTexture, buildRightMesh(x, y, z), submeshes);
  }
  if (!world.isOpaqueBlock(x - 1.0, y, z))
  {
    this.addSubmesh(block.sidesTexture, buildLeftMesh(x, y, z), submeshes);
  }
  if (!world.isOpaqueBlock(x, y, z + 1.0))
  {
    this.addSubmesh(block.sidesTexture, buildFrontMesh(x, y, z), submeshes);
  }
  if (!world.isOpaqueBlock(x, y, z - 1.0))
  {
    this.addSubmesh(block.sidesTexture, buildBackMesh(x, y, z), submeshes);
  }
};

ChunkMeshBuilder.prototype.buildChunkMeshes = function(world)
{
  const submeshes = {};

  for (let x = 0; x < 16; ++x)
  {
    for (let z = 0; z < 16; ++z)
    {
      for (let y = 0; y < 16; ++y)
      {
        const blockId = world.getBlockAt(x, y, z);
        if (blockId != null)
        {
          this.buildBlockMeshes(world, blockId, x, y, z, submeshes);
        }
      }
    }
  }

  return Object.values(submeshes);
};

export {ChunkMeshBuilder as default};
