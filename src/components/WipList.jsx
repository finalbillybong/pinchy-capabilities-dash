import React from 'react';
import './WipList.css';

export default function WipList({ items }) {
  if (!items?.length) {
    return <p className="empty-msg">No work in progress.</p>;
  }

  return (
    <div className="wip-list">
      <h2 className="section-title">🚧 Work in Progress</h2>
      <div className="wip-cards">
        {items.map((item) => (
          <div key={item.name} className="wip-card">
            <div className="wip-top">
              <span className={`wip-badge ${item.status === 'in_progress' ? 'active' : 'planned'}`}>
                {item.status === 'in_progress' ? 'In Progress' : 'Planned'}
              </span>
              <span className="wip-name">{item.name}</span>
            </div>
            {item.description && (
              <p className="wip-desc">{item.description}</p>
            )}
            {item.note && <p className="wip-note">{item.note}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
