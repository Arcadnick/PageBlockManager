import { DndProvider } from 'react-dnd';
import React, { useState, useRef } from 'react';
import BlockField from './BlockField';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { v4 as uuidv4 } from 'uuid';

const MAX_BLOCKS_IN_ROW = 3;

const BlockEditor = () => {
  const [fields, setFields] = useState([[{ id: uuidv4(), number: 1, content: '' }]]);
  const blockCounter = useRef(2); 

  const addBlockToField = (rowIndex) => {
    const updatedFields = [...fields];
    const row = updatedFields[rowIndex];
    if (row.length < MAX_BLOCKS_IN_ROW) {
      const newBlockNumber = blockCounter.current++; 
      row.push({ id: uuidv4(), number: newBlockNumber, content: '' });
      setFields(updatedFields);
    }
  };

  const addFieldBelow = (rowIndex) => {
    const updatedFields = [...fields];
    updatedFields.splice(rowIndex + 1, 0, [{ id: uuidv4(), number: blockCounter.current++, content: '' }]);
    setFields(updatedFields);
  };

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
    const fromRow = updatedFields[fromRowIndex];
    const toRow = updatedFields[toRowIndex];
  
    if (!fromRow || !fromRow[fromBlockIndex] || !toRow || !toRow[toBlockIndex]) {
      return;
    }
  
    const temp = fromRow[fromBlockIndex];
    fromRow[fromBlockIndex] = toRow[toBlockIndex];
    toRow[toBlockIndex] = temp;
  
    setFields(updatedFields);
  };

  const saveToFile = () => {
    const blob = new Blob([JSON.stringify(fields)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'blocks.json'; 
    link.click();
  };

  const uploadFromFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = JSON.parse(e.target.result); 
      setFields(data); 
      blockCounter.current = data.flat().length + 1; 
    };
    reader.readAsText(file);
  };  

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <button style={{ marginLeft: '5px' }} onClick={saveToFile}>save</button>
        <button style={{ marginLeft: '5px' }} >saveDB</button>
        {/* <button style={{ marginLeft: '10px' }}>upload</button> */}
        <label style={{ marginLeft: '10px' }}>
          <input type="file" onChange={uploadFromFile}/>
        </label>
        {fields.map((field, rowIndex) => (
          <BlockField
            key={rowIndex}
            blocks={field}
            onAddBlock={() => addBlockToField(rowIndex)}
            onAddField={() => addFieldBelow(rowIndex)}
            onRemoveBlock={(blockIndex) => removeBlock(rowIndex, blockIndex)}
            canAddRight={field.length < MAX_BLOCKS_IN_ROW}
            moveBlock={moveBlock}
            rowIndex={rowIndex} 
          />
        ))}
      </div>
    </DndProvider>
  );
};
export default BlockEditor;