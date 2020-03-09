function Camera(parent, fov)
{
  this.parent = parent;
  this.fov = fov;
  this.position = [0.0, 2.0, 0.0];
}

Camera.prototype.translate = function(x, y, z)
{
  this.position[0] += x;
  this.position[1] += y;
  this.position[2] += z;
};

Camera.prototype.getPosition = function()
{
  const pos = this.parent.getPosition();
  return this.position.map((v, i) => v + pos[i]);
};

export {Camera as default};
