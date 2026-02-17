import React, { useState } from 'react';
import './CategoryCard.css';

function CopyToast({ visible }) {
  return (
    <span className={`copy-toast ${visible ? 'show' : ''}`}>Copied!</span>
  );
}

function CapabilityItem({ cap, isFav, onToggleFav }) {
  const [copied, setCopied] = useState(null);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(text);
      setTimeout(() => setCopied(null), 1500);
    });
  };

  return (
    <div className="capability">
      <div className="cap-header">
        <span className="cap-name">{cap.name}</span>
        <button
          className={`fav-btn ${isFav ? 'active' : ''}`}
          onClick={() => onToggleFav(cap.name)}
          aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'}
        >
          {isFav ? '★' : '☆'}
        </button>
      </div>
      {cap.description && (
        <p className="cap-description">{cap.description}</p>
      )}
      {cap.triggers?.length > 0 && (
        <div className="cap-triggers">
          {cap.triggers.map((trigger) => (
            <button
              key={trigger}
              className="trigger-chip"
              onClick={() => handleCopy(trigger)}
              title={`Copy "${trigger}"`}
            >
              {trigger}
              <CopyToast visible={copied === trigger} />
            </button>
          ))}
        </div>
      )}
      {cap.examples?.length > 0 && (
        <div className="cap-examples">
          {cap.examples.map((ex) => (
            <button
              key={ex}
              className="example-text"
              onClick={() => handleCopy(ex)}
              title={`Copy "${ex}"`}
            >
              "{ex}"
              <CopyToast visible={copied === ex} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoryCard({ category, isFav, onToggleFav }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="category-card">
      <button
        className="category-header"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <span className="category-icon">{category.icon}</span>
        <span className="category-name">{category.name}</span>
        <span className="category-count">{category.capabilities.length}</span>
        <span className={`category-chevron ${expanded ? 'open' : ''}`}>
          ›
        </span>
      </button>
      {expanded && (
        <div className="category-body">
          {category.capabilities.map((cap) => (
            <CapabilityItem
              key={cap.name}
              cap={cap}
              isFav={isFav(cap.name)}
              onToggleFav={onToggleFav}
            />
          ))}
        </div>
      )}
    </div>
  );
}
