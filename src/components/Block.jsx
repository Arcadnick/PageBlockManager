import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

const Block = ({ id, blockIndex, onRemove, moveBlock, rowIndex }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: 'block',
    item: { id, rowIndex, blockIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: 'block',
    hover: (item) => {
      if (item.rowIndex !== rowIndex || item.blockIndex !== blockIndex) {
        moveBlock(item.rowIndex, item.blockIndex, rowIndex, blockIndex);
        item.rowIndex = rowIndex;
        item.blockIndex = blockIndex;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div
      ref={dropRef}
      className={`block-container ${isDragging ? 'dragging' : ''} ${isOver && canDrop ? 'hovered' : ''}`}
    >
      <div ref={dragRef} className="block-header">
      </div>
      
      <div className="block-content">
        <span className="block-number">{blockIndex + 1}</span> 
      </div>

      <button className="delete" onClick={onRemove}>
      ×
      </button>
    </div>
  );
};

export default Block;