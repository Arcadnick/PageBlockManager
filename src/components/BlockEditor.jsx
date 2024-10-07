import { DndProvider } from 'react-dnd';
import React, { useState } from 'react';
import BlockField from './BlockField';
import { HTML5Backend } from 'react-dnd-html5-backend';

const MAX_BLOCKS_IN_ROW = 3;

const BlockEditor = () => {
  const [fields, setFields] = useState([[{ id: Date.now(), content: '' }]]);

  const addBlockToField = (rowIndex) => {
    const updatedFields = [...fields];
    const row = updatedFields[rowIndex];
    if (row.length < MAX_BLOCKS_IN_ROW) {
      row.push({ id: Date.now(), content: '' });
      setFields(updatedFields);
    }
  };

  const addFieldBelow = (rowIndex) => {
    const updatedFields = [...fields];
    updatedFields.splice(rowIndex + 1, 0, [{ id: Date.now(), content: '' }]);
    setFields(updatedFields);
  };

  // const updateBlockContent = (rowIndex, blockIndex, content) => {
  //   const updatedFields = fields.map((field, rIdx) =>
  //     rIdx === rowIndex
  //       ? field.map((block, bIdx) => (bIdx === blockIndex ? { ...block, content } : block))
  //       : field
  //   );
  //   setFields(updatedFields);
  // };

  const removeBlock = (rowIndex, blockIndex) => {
    const updatedFields = fields
      .map((field, rIdx) =>
        rIdx === rowIndex ? field.filter((_, bIdx) => bIdx !== blockIndex) : field
      )
      .filter((field) => field.length > 0);
    setFields(updatedFields);
  };

  const moveBlock = (fromRowIndex, fromBlockIndex, toRowIndex, toBlockIndex) => {
    const updatedFields = [...fields];

    if (!updatedFields[fromRowIndex] || !updatedFields[fromRowIndex][fromBlockIndex]) return;

    const [movedBlock] = updatedFields[fromRowIndex].splice(fromBlockIndex, 1);

    if (!updatedFields[toRowIndex]) {
      updatedFields[toRowIndex] = [];
    }

    updatedFields[toRowIndex].splice(toBlockIndex, 0, movedBlock);

    setFields(updatedFields);
  };

  const allBlocks = fields.flat(); 

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        {fields.map((field, rowIndex) => (
          <BlockField
            key={rowIndex}
            blocks={field}
            onAddBlock={() => addBlockToField(rowIndex)}
            onAddField={() => addFieldBelow(rowIndex)}
            //onUpdateBlock={(blockIndex, content) => updateBlockContent(rowIndex, blockIndex, content)}
            onRemoveBlock={(blockIndex) => removeBlock(rowIndex, blockIndex)}
            canAddRight={field.length < MAX_BLOCKS_IN_ROW}
            moveBlock={moveBlock}
            allBlocks={allBlocks} 
          />
        ))}
      </div>
    </DndProvider>
  );
};

export default BlockEditor;