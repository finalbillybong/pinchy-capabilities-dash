import React, { useRef } from 'react';
import './SearchBar.css';

export default function SearchBar({ value, onChange }) {
  const inputRef = useRef(null);

  return (
    <div className="search-bar">
      <div className="search-input-wrap">
        <span className="search-icon">🔍</span>
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search capabilities..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Search capabilities"
        />
        {value && (
          <button
            className="search-clear"
            onClick={() => {
              onChange('');
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
