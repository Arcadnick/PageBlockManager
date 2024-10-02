import React from 'react';
import Block from './Block';

const BlockField = ({ blocks, onAddBlock, onAddField, onUpdateBlock, onRemoveBlock, canAddRight, moveBlock, rowIndex }) => {
  return (
    <div style={{ position: 'relative', marginBottom: '20px', width: '100%' }}>
      <div style={{ display: 'flex', width: '100%' }}>
        {blocks.map((block, blockIndex) => (
          <Block
            key={block.id}
            id={block.id}
            content={block.content}
            onContentChange={(content) => onUpdateBlock(blockIndex, content)}
            onRemove={() => onRemoveBlock(blockIndex)}
            moveBlock={moveBlock}
            rowIndex={rowIndex}
            blockIndex={blockIndex}
          />
        ))}
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