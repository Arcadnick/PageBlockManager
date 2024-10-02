import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

const Block = ({ id, content, onContentChange, onRemove, moveBlock, rowIndex, blockIndex }) => {
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
      ref={(node) => dragRef(dropRef(node))} 
      style={{
        flex: 1,
        border: isOver && canDrop ? '2px dashed green' : '1px solid black', 
        margin: '5px',
        padding: '10px',
        boxSizing: 'border-box',
        cursor: 'move',
        opacity: isDragging ? 0.5 : 1, 
      }}
    >
      <textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="text"
        style={{ width: '98%', height: '100px' }}
      />
      <button className="delete" onClick={onRemove}>
        Del
      </button>
    </div>
  );
};

export default Block;