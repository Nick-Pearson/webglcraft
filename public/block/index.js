import OakLog from './oaklog.js';

const getBlock = function(blockId)
{
  if (blockId === 'oak_log')
  {
    return OakLog;
  }

  return undefined;
};

export {getBlock};
