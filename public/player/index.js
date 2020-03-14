import Camera from '../camera/index.js';
import RigidBody from '../physics/rigidbody.js';

function Player()
{
  this.camera = new Camera(this, 45.0);
  this.rigidbody = new RigidBody(this);
  this.position = [-6.0, -13.0, -10.0];
}

Player.prototype.update = function(deltaTime)
{
  console.log(this.position);
};

Player.prototype.getPosition = function()
{
  return this.position;
};

export {Player as default};
