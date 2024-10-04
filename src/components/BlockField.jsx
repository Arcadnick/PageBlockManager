import React from 'react';
import Block from './Block';

const BlockField = ({
  blocks,
  onAddBlock,
  onAddField,
  onRemoveBlock,
  canAddRight,
  moveBlock,
  allBlocks, 
}) => {
  return (
    <div style={{ position: 'relative', marginBottom: '20px', width: '100%' }}>
      <div style={{ display: 'flex', width: '100%' }}>
        {blocks.map((block, blockIndex) => {
          const globalBlockIndex = allBlocks.indexOf(block);
          
          return (
            <Block
              key={block.id}
              id={block.id}
              blockIndex={globalBlockIndex} 
              onRemove={() => onRemoveBlock(blockIndex)}
              moveBlock={moveBlock}
              rowIndex={blocks.rowIndex}
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