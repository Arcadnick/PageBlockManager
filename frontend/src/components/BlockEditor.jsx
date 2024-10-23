import { DndProvider } from 'react-dnd';
import React, { useState, useRef } from 'react';
import BlockField from './BlockField';
import { HTML5Backend } from 'react-dnd-html5-backend';

const MAX_BLOCKS_IN_ROW = 3;

const BlockEditor = () => {
  const [fields, setFields] = useState([[{number: 1, content: '' }]]);
  const blockCounter = useRef(2); 

  const saveToDatabase = async () => {
    try {
      const response = await fetch('http://localhost:8000/api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save', data: fields })
      });
      
      if (response.ok) {
        console.log("Data saved to the database successfully");
      } else {
        console.error("Failed to save data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
};

const loadFromDatabase = async () => {
  try {
    const response = await fetch('http://localhost:8000/api.php?action=load');
    if (response.ok) {
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        setFields(data);
      } else {
        alert("Данные не найдены в базе. Блоки останутся без изменений.");
        console.error("No data found in the database.");
      }
    } else {
      console.error("Failed to load data");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

  const addBlockToField = (rowIndex) => {
    const updatedFields = [...fields];
    const row = updatedFields[rowIndex];
    if (row.length < MAX_BLOCKS_IN_ROW) {
      const newBlockNumber = blockCounter.current++; 
      row.push({ number: newBlockNumber, content: '' });
      setFields(updatedFields);
    }
  };

  const addFieldBelow = (rowIndex) => {
    const updatedFields = [...fields];
    updatedFields.splice(rowIndex + 1, 0, [{ number: blockCounter.current++, content: '' }]);
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

  // const saveToFile = () => {
  //   const blob = new Blob([JSON.stringify(fields)], { type: 'application/json' });
  //   const link = document.createElement('a');
  //   link.href = URL.createObjectURL(blob);
  //   link.download = 'blocks.json'; 
  //   link.click();
  // };

  // const uploadFromFile = (event) => {
  //   const file = event.target.files[0];
  //   if (!file) return;
    
  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     const data = JSON.parse(e.target.result); 
  //     setFields(data); 
  //     blockCounter.current = data.flat().length + 1; 
  //   };
  //   reader.readAsText(file);
  // };  

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <button style={{ marginLeft: '5px' }} onClick={saveToDatabase}>Save to DB</button>
        <button style={{ marginLeft: '5px' }} onClick={loadFromDatabase}>Load from DB</button>
        {/* <button style={{ marginLeft: '25px' }} onClick={saveToFile}>Save to file</button> 
        <label style={{ marginLeft: '5px' }}>
          <input type="file" onChange={uploadFromFile}/>
        </label> */}
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