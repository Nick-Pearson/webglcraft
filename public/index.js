import Player from './player/index.js';
import RenderEngine from './renderengine/index.js';
import TextureLoader from './textureloader/index.js';
import MeshLoader from './meshloader/index.js';
import ChunkMeshBuilder from './chunk/index.js';
import World from './world/index.js';
import {getPhysicsEngine} from './physics/index.js';

//
// start here
//
function main()
{
  const canvas = document.querySelector('#glCanvas');
  const fpsCounter = document.querySelector('#fpsCounter');

  // Initialize the GL context
  const gl = canvas.getContext('webgl');
  const player = new Player();
  const renderer = new RenderEngine(gl, player.camera);
  const textureLoader = new TextureLoader(gl);
  const meshLoader = new MeshLoader(gl);
  const meshBuilder = new ChunkMeshBuilder(textureLoader);
  const physicsEngine = getPhysicsEngine();

  // Only continue if WebGL is available and working
  if (gl === null)
  {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  const shader = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
    },
  };

  const world = new World();
  const meshes = meshBuilder.buildChunkMeshes(world);
  for (const mesh of meshes)
  {
    const glMesh = meshLoader.loadMesh(mesh);
    renderer.addObject(glMesh, shader);
  }

  let last = performance.now();
  let deltaTime = 0.0;

  function render(now)
  {
    updateGameLogic(deltaTime, [player]);
    physicsEngine.update(deltaTime);
    renderer.drawScene();

    deltaTime = (now - last) / 1000;
    const framTimeMs = (now - last).toFixed(2);
    const fps = (1000 / (now - last)).toFixed(0);
    fpsCounter.textContent = fps + ' FPS ( ' + framTimeMs + 'ms )';

    last = now;
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

window.onload = main;

function updateGameLogic(deltaTime, objects)
{
  for (let i = 0; i < objects.length; ++i)
  {
    objects[i].update(deltaTime);
  }
}

// Vertex shader program

const vsSource = `
    attribute vec4 aVertexPosition;

    attribute vec2 aTextureCoord;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    
    varying highp vec2 vTextureCoord;

    void main() 
    {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;
    }
`;

const fsSource = `
    varying highp vec2 vTextureCoord;

    uniform sampler2D uSampler;
    
    void main() 
    {
      gl_FragColor = texture2D(uSampler, vTextureCoord);
    }
`;

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource)
{
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
  {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source)
{
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
  {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
