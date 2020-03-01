function RenderEngine(gl)
{
    console.log("Initialising RenderEngine");
    this.gl = gl;
    this.renderables = [];
    this.projectionMatrix = createProjectionMatrix(gl, 45);

    initGL(gl);
}

function initGL(gl)
{
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clearColor(0.0, 0.0, 0.2, 1.0);
    gl.clearDepth(1.0);
}

function createProjectionMatrix(gl, fov)
{
    const fieldOfView = fov * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    mat4.perspective(projectionMatrix,
                        fieldOfView, 
                        aspect,
                        zNear,
                        zFar);

    return projectionMatrix;
}

RenderEngine.prototype.drawScene = function(time)
{
    const gl = this.gl;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this.renderables.forEach(renderable => {
        this.draw(renderable, time);
    });
};

RenderEngine.prototype.draw = function(renderable, time)
{
    let gl = this.gl;

    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = mat4.create();

    // Now move the drawing position a bit to where we want to
    // start drawing the square.

    mat4.translate(modelViewMatrix,     // destination matrix
                    modelViewMatrix,     // matrix to translate
                    [-0.0, 0.0, -6.0]);  // amount to translate

    mat4.rotate(modelViewMatrix, modelViewMatrix, time, [1, 0, 0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, time * .7, [0, 1, 0]);

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    {
        const numComponents = 3;  // pull out 2 values per iteration
        const type = gl.FLOAT;    // the data in the buffer is 32bit floats
        const normalize = false;  // don't normalize
        const stride = 0;         // how many bytes to get from one set of values to the next
                                // 0 = use type and numComponents above
        const offset = 0;         // how many bytes inside the buffer to start from
        gl.bindBuffer(gl.ARRAY_BUFFER, renderable.mesh.verts);
        gl.vertexAttribPointer(
            renderable.shader.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            renderable.shader.attribLocations.vertexPosition);
    }

    {
      // Tell WebGL which indices to use to index the vertices
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, renderable.mesh.tris);
    }

    // Tell WebGL to use our program when drawing
    gl.useProgram(renderable.shader.program);

    // Set the shader uniforms
    gl.uniformMatrix4fv(
        renderable.shader.uniformLocations.projectionMatrix,
        false,
        this.projectionMatrix);
    gl.uniformMatrix4fv(
        renderable.shader.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix);

    {
        const vertexCount = renderable.mesh.numTris;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
}

RenderEngine.prototype.addObject = function(mesh, shader)
{
    this.renderables.push({
        mesh: mesh,
        shader: shader
    });
}

export { RenderEngine as default };