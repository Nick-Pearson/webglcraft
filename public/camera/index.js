function Camera(fov)
{
  this.fov = fov;
  this.position = [-8.0, -2.0, -32.0];
}

Camera.prototype.translate = function(x, y, z)
{
  this.position[0] += x;
  this.position[1] += y;
  this.position[2] += z;
};

export {Camera as default};
