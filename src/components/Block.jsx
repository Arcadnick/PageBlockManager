import React from 'react';

const Block = ({ content, onContentChange, onRemove }) => {
  return (
    <div style={{ flex: 1, border: '1px solid black', margin: '5px', padding: '10px', boxSizing: 'border-box' }}>
      <textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="text"
        style={{ width: '98%', height: '100px' }}
      />
      <button class='delete' onClick={onRemove}>
        Del
      </button>
    </div>
  );
};

export default Block;