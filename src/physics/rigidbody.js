import physicsEngine from './physicsengine.js';

function Rigidbody(parent)
{
  this.parent = parent;
  this.applyGravity = true;
  this.velocity = [0.0, 0.0, 0.0];
  this.movable = true;
  physicsEngine.rigidbodies.push(this);
}

export {Rigidbody as default};
