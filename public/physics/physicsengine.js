function PhysicsEngine()
{
  this.rigidbodies = [];
  console.log('Initialising PhysicsEngine');
}

function updateBodyPosition(body, deltaTime)
{
  body.parent.position[1] += (body.velocity[0] * deltaTime);
  body.parent.position[1] += (body.velocity[1] * deltaTime);
  body.parent.position[1] += (body.velocity[2] * deltaTime);

  if (body.applyGravity)
  {
    body.velocity[1] += 9.81 * deltaTime;
  }
}

function isColliding(body)
{
  return (body.parent.position[1] > -11);
}

PhysicsEngine.prototype.update = function(deltaTime)
{
  for (let i = 0; i < this.rigidbodies.length; ++i)
  {
    const rigidbody = this.rigidbodies[i];

    if (rigidbody.movable)
    {
      updateBodyPosition(rigidbody, deltaTime);

      if (isColliding(rigidbody))
      {
        console.log('colliding');
        rigidbody.movable = false;
      }
    }
  }
};

const physicsEngine = new PhysicsEngine();
Object.freeze(physicsEngine);

export default physicsEngine;
