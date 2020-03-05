function World()
{
  this.heights = new Array(16 * 16);
  for (let x = 0; x < 16; x++)
  {
    for (let z = 0; z < 16; z++)
    {
      this.heights[x + (z*16)] = 10.0 + Math.floor(x / 3.0);
    }
  }
}

World.prototype.isOpaqueBlock = function(x, y, z)
{
  const height = this.heights[x + (z*16)];
  return y <= height;
};

World.prototype.getBlockAt = function(x, y, z)
{
  if (y == 0.0)
  {
    return 'bedrock_block';
  }
  const height = this.heights[x + (z*16)];
  if (y < height)
  {
    return 'dirt_block';
  }
  if (y == height)
  {
    return 'grass_block';
  }
  return null;
};

export {World as default};
