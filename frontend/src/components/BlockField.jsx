import React from 'react';
import Block from './Block';

const BlockField = ({
  blocks,
  onAddBlock,
  onAddField,
  onRemoveBlock,
  canAddRight,
  moveBlock,
  rowIndex
}) => {
  return (
    <div className='block-field-container'>
      <div style={{ display: 'flex', width: '100%' }}>
        {blocks.map((block, blockIndex) => {
          return (
            <Block
              key={block.number}
              blockIndex={blockIndex} 
              blockNumber={block.number} 
              rowIndex={rowIndex}
              blocks={blocks} 
              moveBlock={moveBlock} 
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