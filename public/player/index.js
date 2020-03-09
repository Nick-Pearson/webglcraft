import Camera from '../camera/index.js';

function Player()
{
  this.camera = new Camera(this, 45.0);
  this.position = [-6.0, -13.0, -10.0];
  this.velocity = [0.0, 0.0, 0.0];
}

Player.prototype.update = function(deltaTime)
{
  this.position[1] += (this.velocity[1] * deltaTime);
  this.velocity[1] += 9.81 * deltaTime;
};

Player.prototype.getPosition = function()
{
  return this.position;
};

export {Player as default};
