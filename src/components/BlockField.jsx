import React from 'react';
import Block from './Block';

const BlockField = ({
  blocks,
  onAddBlock,
  onAddField,
  onRemoveBlock,
  canAddRight,
  moveBlock,
  rowIndex,
  MAX_BLOCKS_IN_ROW
}) => {
  return (
    <div style={{ position: 'relative', marginBottom: '20px', width: '100%' }}>
      <div style={{ display: 'flex', width: '100%' }}>
        {blocks.map((block, blockIndex) => {
          return (
            <Block
              key={block.id}
              id={block.id}
              blockIndex={blockIndex} 
              blockNumber={block.number} 
              rowIndex={rowIndex}
              blocks={blocks} 
              moveBlock={moveBlock}
              MAX_BLOCKS_IN_ROW={MAX_BLOCKS_IN_ROW} 
              onRemove={() => onRemoveBlock(blockIndex)}
            />
          );
        })}
        {canAddRight && (
          <button className="add-block" onClick={onAddBlock}>
            +
          </button>
        )}
      </div>

      <button className="add-fields" onClick={onAddField}>
        +
      </button>
    </div>
  );
};
export default BlockField;