import React from 'react';
import './Header.css';

export default function Header({ theme, onToggleTheme }) {
  return (
    <header className="header">
      <div className="header-left">
        <span className="header-icon">🦀</span>
        <h1 className="header-title">Pinchy</h1>
      </div>
      <button
        className="theme-toggle"
        onClick={onToggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </header>
  );
}
