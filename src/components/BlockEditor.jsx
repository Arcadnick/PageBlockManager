import React, { useState } from 'react';
import Block from './Block';

const MAX_BLOCKS_IN_ROW = 3;

const BlockEditor = () => {
  const [grid, setGrid] = useState([[{ id: Date.now(), content: '' }]]);

  const addBlock = (position, rowIndex, colIndex) => {
    const newBlock = { id: Date.now(), content: '' };

    const updatedGrid = [...grid];
    
    if (position === 'right') {
      if (updatedGrid[rowIndex].length < MAX_BLOCKS_IN_ROW) {
        updatedGrid[rowIndex].splice(colIndex + 1, 0, newBlock);
      }
    } else if (position === 'down') {
      updatedGrid.splice(rowIndex + 1, 0, [newBlock]);
    }

    setGrid(updatedGrid);
  };

  const removeBlock = (rowIndex, colIndex) => {
    const updatedGrid = [...grid];
    updatedGrid[rowIndex].splice(colIndex, 1);
    if (updatedGrid[rowIndex].length === 0) {
      updatedGrid.splice(rowIndex, 1); 
    }
    setGrid(updatedGrid);
  };

  const updateBlockContent = (rowIndex, colIndex, content) => {
    const updatedGrid = grid.map((row, rIdx) => 
      rIdx === rowIndex 
        ? row.map((block, cIdx) => cIdx === colIndex ? { ...block, content } : block)
        : row
    );
    setGrid(updatedGrid);
  };

  return (
    <div>
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex' }}>
          {row.map((block, colIndex) => (
            <Block
              key={block.id}
              id={block.id}
              content={block.content}
              onContentChange={(content) => updateBlockContent(rowIndex, colIndex, content)}
              onRemove={() => removeBlock(rowIndex, colIndex)}
              onAddBlock={addBlock}
              rowIndex={rowIndex}
              colIndex={colIndex}
              canAddRight={row.length < MAX_BLOCKS_IN_ROW} 
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default BlockEditor;