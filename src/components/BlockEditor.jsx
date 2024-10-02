import React, { useState } from 'react';
import BlockField from './BlockField';

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

  const updateBlockContent = (rowIndex, blockIndex, content) => {
    const updatedFields = fields.map((field, rIdx) =>
      rIdx === rowIndex
        ? field.map((block, bIdx) => (bIdx === blockIndex ? { ...block, content } : block))
        : field
    );
    setFields(updatedFields);
  };

  const removeBlock = (rowIndex, blockIndex) => {
    const updatedFields = fields.map((field, rIdx) =>
        rIdx === rowIndex ? field.filter((_, bIdx) => bIdx !== blockIndex) : field
      ).filter(field => field.length > 0); 
    setFields(updatedFields);
  };
  

  return (
    <div>
      {fields.map((field, rowIndex) => (
        <BlockField
          key={rowIndex}
          blocks={field}
          onAddBlock={() => addBlockToField(rowIndex)}
          onAddField={() => addFieldBelow(rowIndex)}
          onUpdateBlock={(blockIndex, content) => updateBlockContent(rowIndex, blockIndex, content)}
          onRemoveBlock={(blockIndex) => removeBlock(rowIndex, blockIndex)}
          canAddRight={field.length < MAX_BLOCKS_IN_ROW} 
        />
      ))}
    </div>
  );
};

export default BlockEditor;