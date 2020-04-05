function rotateAroundY(vector, angle)
{
  const sinA = Math.sin(angle);
  const cosA = Math.cos(angle);

  return vec3.fromValues(
      (vector[0] * cosA) + (vector[2] * sinA),
      vector[1],
      (vector[2] * cosA) + (vector[0] * -sinA),
  );
}

export {rotateAroundY};
