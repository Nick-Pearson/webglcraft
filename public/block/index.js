import OakLog from './oaklog.js';
import Grass from './grass.js';

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

  return undefined;
};

export {getBlock};
