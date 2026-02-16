import React from 'react';
import './IntegrationList.css';

export default function IntegrationList({ integrations }) {
  if (!integrations?.length) {
    return <p className="empty-msg">No integrations configured.</p>;
  }

  return (
    <div className="integration-list">
      <h2 className="section-title">🔌 Integrations</h2>
      <div className="integration-cards">
        {integrations.map((item) => (
          <div key={item.name} className="integration-card">
            <span className="integration-icon">{item.icon}</span>
            <div className="integration-info">
              <span className="integration-name">{item.name}</span>
              {item.description && (
                <span className="integration-desc">{item.description}</span>
              )}
            </div>
            <span
              className={`integration-status ${item.status === 'connected' ? 'connected' : 'disconnected'}`}
            >
              {item.status === 'connected' ? '●' : '○'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
