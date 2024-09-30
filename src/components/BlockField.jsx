import React from 'react';
import Block from './Block';

const BlockField = ({ blocks, onAddBlock, onAddField, onUpdateBlock, onRemoveBlock, canAddRight }) => {
  return (
    <div style={{ position: 'relative', marginBottom: '20px', width: '100%' }}>
        <div style={{ display: 'flex', width: '100%' }}>
            {blocks.map((block, blockIndex) => (
            <Block
                key={block.id}
                content={block.content}
                onContentChange={(content) => onUpdateBlock(blockIndex, content)}
                onRemove={() => onRemoveBlock(blockIndex)}
            />
            ))}
            {canAddRight && (
                <button class='add-block' onClick={onAddBlock}>
                    +
                    </button>
            )}
        </div>

        <button class='add-fields' onClick={onAddField}>
        +
        </button>
    </div>
  );
};

export default BlockField;