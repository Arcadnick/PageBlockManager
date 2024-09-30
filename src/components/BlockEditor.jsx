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

  const addFieldBelow = () => {
    setFields([...fields, [{ id: Date.now(), content: '' }]]);
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
          onAddField={addFieldBelow}
          onUpdateBlock={(blockIndex, content) => updateBlockContent(rowIndex, blockIndex, content)}
          onRemoveBlock={(blockIndex) => removeBlock(rowIndex, blockIndex)}
          canAddRight={field.length < MAX_BLOCKS_IN_ROW} // Проверка, можно ли добавить блок справа
        />
      ))}
    </div>
  );
};

export default BlockEditor;