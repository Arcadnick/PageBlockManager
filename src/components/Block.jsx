import React from 'react';

const Block = ({ id, content, onContentChange, onRemove, onAddBlock, rowIndex, colIndex, canAddRight }) => {
  const handleContentChange = (e) => {
    onContentChange(e.target.value);
  };

  return (
    <div style={{ position: 'relative', border: '1px solid black', margin: '10px', padding: '10px', display: 'inline-block' }}>
      <textarea
        value={content}
        onChange={handleContentChange}
        placeholder="Введите текст блока"
        style={{ width: '200px', height: '100px' }}
      />
      <button onClick={onRemove}>Удалить блок</button>

      {canAddRight && (
        <button 
          onClick={() => onAddBlock('right', rowIndex, colIndex)}
          style={{ position: 'absolute', top: '50%', right: '-20px', transform: 'translateY(-50%)' }}
        >
          +
        </button>
      )}

      <button 
        onClick={() => onAddBlock('down', rowIndex, colIndex)}
        style={{ position: 'absolute', bottom: '-20px', left: '50%', transform: 'translateX(-50%)' }}
      >
        +
      </button>
    </div>
  );
};

export default Block;