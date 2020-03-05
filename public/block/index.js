import OakLog from './oaklog.js';
import Grass from './grass.js';
import Dirt from './dirt.js';
import Bedrock from './bedrock.js';

const getBlock = function(blockId)
{
  if (blockId === 'oak_log')
  {
    return OakLog;
  }
  else if (blockId === 'grass_block')
  {
    return Grass;
  }
  else if (blockId === 'dirt_block')
  {
    return Dirt;
  }
  else if (blockId === 'bedrock_block')
  {
    return Bedrock;
  }

  console.error('unrecognised block id ' + blockId);
  return undefined;
};

export {getBlock};
