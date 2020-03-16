import Camera from '../camera/index.js';
import RigidBody from '../physics/rigidbody.js';

function Player()
{
  this.camera = new Camera(this, 45.0);
  this.rigidbody = new RigidBody(this);
  this.position = [-6.0, -13.0, -10.0];

  this.moveAxis = [0.0, 0.0];
  this.currentMoveSpeed = [0.0, 0.0];
  document.addEventListener('keydown', (event) => this.keyHandler(event, true), false);
  document.addEventListener('keyup', (event) => this.keyHandler(event, false), false);
}

Player.prototype.keyHandler = function(event, value)
{
  if (event.keyCode == 68)
  {
    this.moveAxis[0] = value ? -1.0 : 0.0;
  }
  else if (event.keyCode == 65)
  {
    this.moveAxis[0] = value ? 1.0 : 0.0;
  }
  else if (event.keyCode == 83)
  {
    this.moveAxis[1] = value ? -1.0 : 0.0;
  }
  else if (event.keyCode == 87)
  {
    this.moveAxis[1] = value ? 1.0 : 0.0;
  }
};

const MAX_MOVE_SPEED = 8.0;
const MOVE_ACCELERATION = MAX_MOVE_SPEED * 4.0;
const DECELERATION_RATE = MAX_MOVE_SPEED * 2.0;

Player.prototype.update = function(deltaTime)
{
  if (this.moveAxis[0] == 0.0)
  {
    this.currentMoveSpeed[0] -= (this.currentMoveSpeed[0] * DECELERATION_RATE * deltaTime);
  }
  else
  {
    this.currentMoveSpeed[0] += this.moveAxis[0] * MOVE_ACCELERATION * deltaTime;
  }
  this.currentMoveSpeed[0] = Math.min(MAX_MOVE_SPEED, Math.max(-MAX_MOVE_SPEED, this.currentMoveSpeed[0]));
  this.position[0] += this.currentMoveSpeed[0] * deltaTime;

  if (this.moveAxis[1] == 0.0)
  {
    this.currentMoveSpeed[1] -= (this.currentMoveSpeed[1] * DECELERATION_RATE * deltaTime);
  }
  else
  {
    this.currentMoveSpeed[1] += this.moveAxis[1] * MOVE_ACCELERATION * deltaTime;
  }
  this.currentMoveSpeed[1] = Math.min(MAX_MOVE_SPEED, Math.max(-MAX_MOVE_SPEED, this.currentMoveSpeed[1]));
  this.position[2] += this.currentMoveSpeed[1] * deltaTime;
};

Player.prototype.getPosition = function()
{
  return this.position;
};

export {Player as default};
