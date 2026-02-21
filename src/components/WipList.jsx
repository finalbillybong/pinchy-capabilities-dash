import React from 'react';
import './WipList.css';

export default function WipList({ items }) {
  if (!items?.length) {
    return <p className="empty-msg">No work in progress.</p>;
  }

  const isActive = (item) => {
    const s = String(item?.status || '').toLowerCase();
    return s === 'in_progress' || s === 'in-progress' || s === 'active';
  };

  return (
    <div className="wip-list">
      <h2 className="section-title">🚧 Work in Progress</h2>
      <div className="wip-cards">
        {items.map((item) => (
          <div key={item.name} className="wip-card">
            <div className="wip-top">
              <span className={`wip-badge ${isActive(item) ? 'active' : 'planned'}`}>
                {isActive(item) ? 'In Progress' : 'Planned'}
              </span>
              <span className="wip-name">{item.name}</span>
            </div>
            {(item.description || item.summary) && (
              <p className="wip-desc">{item.description || item.summary}</p>
            )}
            {item.note && <p className="wip-note">{item.note}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
