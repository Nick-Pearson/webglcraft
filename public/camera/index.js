function Camera(parent, fov)
{
  this.parent = parent;
  this.fov = fov;
  this.position = [0.0, 2.0, 0.0];
  this.angle = 0.0;
}

Camera.prototype.translate = function(x, y, z)
{
  this.position[0] += x;
  this.position[1] += y;
  this.position[2] += z;
};

const MIN_ANGLE = -1.3;
const MAX_ANGLE = 1.3;

Camera.prototype.rotate = function(angle)
{
  this.angle += angle;

  if (this.angle < MIN_ANGLE)
  {
    this.angle = MIN_ANGLE;
  }
  else if (this.angle > MAX_ANGLE)
  {
    this.angle = MAX_ANGLE;
  }
};

Camera.prototype.getPosition = function()
{
  const pos = this.parent.getPosition();
  return this.position.map((v, i) => v + pos[i]);
};

Camera.prototype.getRotation = function()
{
  const out = quat.create();
  quat.rotateX(out, this.parent.getRotation(), this.angle);
  return out;
};

export {Camera as default};
