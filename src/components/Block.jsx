import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

const Block = ({ id, blockIndex, blockNumber, onRemove, moveBlock, rowIndex, blocks }) => {
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
        <span className="block-coordinates">
          {rowIndex + 1}:{blockIndex + 1}
        </span>
        <button className="delete" onClick={onRemove}>
          ×
        </button>
      </div>
      
      <div className="block-content">
        <span className="block-number">{blockNumber}</span>
        <span>{blocks.content="content " + blockNumber}</span>
      </div>
    </div>
  );
};
export default Block;