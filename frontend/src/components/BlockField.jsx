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

  console.log("Blocks in BlockField:", blocks); // Логируем блоки

  if (!Array.isArray(blocks)) {
    console.error("Blocks is not an array:", blocks);
    return null; // Или можно вернуть что-то по умолчанию
  }

  return (
    <div style={{ position: 'relative', marginBottom: '20px', width: '100%' }}>
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