import React, { useState } from 'react';
import { getNextRun, formatNextRun } from '../utils/cronNext';
import './Dashboard.css';

function StatCard({ icon, label, value, sub }) {
  return (
    <div className="stat-card">
      <span className="stat-icon">{icon}</span>
      <div className="stat-info">
        <span className="stat-value">{value}</span>
        <span className="stat-label">{label}</span>
        {sub && <span className="stat-sub">{sub}</span>}
      </div>
    </div>
  );
}

function FavDetail({ cap }) {
  const [copied, setCopied] = useState(null);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(text);
      setTimeout(() => setCopied(null), 1500);
    });
  };

  return (
    <div className="fav-detail">
      {cap.description && (
        <p className="fav-detail-desc">{cap.description}</p>
      )}
      {cap.triggers?.length > 0 && (
        <div className="fav-detail-triggers">
          {cap.triggers.map((trigger) => (
            <button
              key={trigger}
              className="fav-detail-chip"
              onClick={(e) => { e.stopPropagation(); handleCopy(trigger); }}
              title={`Copy "${trigger}"`}
            >
              {trigger}
              <span className={`fav-copy-toast ${copied === trigger ? 'show' : ''}`}>
                Copied!
              </span>
            </button>
          ))}
        </div>
      )}
      {cap.examples?.length > 0 && (
        <div className="fav-detail-examples">
          {cap.examples.map((ex) => (
            <button
              key={ex}
              className="fav-detail-example"
              onClick={(e) => { e.stopPropagation(); handleCopy(ex); }}
              title={`Copy "${ex}"`}
            >
              "{ex}"
              <span className={`fav-copy-toast ${copied === ex ? 'show' : ''}`}>
                Copied!
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Dashboard({ data, favourites, onNavigate }) {
  const [expandedFav, setExpandedFav] = useState(null);

  if (!data) return null;

  const totalCaps = (data.categories || []).reduce(
    (sum, cat) => sum + cat.capabilities.length, 0
  );
  const connectedCount = (data.integrations || []).filter(
    (i) => i.status === 'connected'
  ).length;
  const activeJobs = (data.cronJobs || []).filter(
    (j) => j.status === 'active'
  ).length;
  const isWipActive = (w) => {
    const s = String(w?.status || '').toLowerCase();
    return s === 'in_progress' || s === 'in-progress' || s === 'active';
  };

  const wipActive = (data.wip || []).filter(isWipActive).length;

  // Find next upcoming job
  const jobsWithNext = (data.cronJobs || [])
    .filter((j) => j.status === 'active')
    .map((j) => ({ ...j, nextRun: getNextRun(j.schedule) }))
    .filter((j) => j.nextRun)
    .sort((a, b) => a.nextRun - b.nextRun);

  const nextJob = jobsWithNext[0];

  // Favourite capabilities
  const favCaps = [];
  if (favourites?.length) {
    for (const cat of data.categories || []) {
      for (const cap of cat.capabilities) {
        if (favourites.includes(cap.name)) {
          favCaps.push({ ...cap, categoryIcon: cat.icon });
        }
      }
    }
  }

  const toggleExpand = (name) => {
    setExpandedFav((prev) => (prev === name ? null : name));
  };

  return (
    <div className="dashboard">
      <h2 className="section-title">Overview</h2>

      <div className="stat-grid">
        <StatCard
          icon="📋"
          label="Capabilities"
          value={totalCaps}
        />
        <StatCard
          icon="🔌"
          label="Connected"
          value={`${connectedCount}/${(data.integrations || []).length}`}
        />
        <StatCard
          icon="⏰"
          label="Active Jobs"
          value={activeJobs}
        />
        <StatCard
          icon="🚧"
          label="In Progress"
          value={wipActive}
        />
      </div>

      {nextJob && (
        <div className="dash-section">
          <h3 className="dash-section-title">Next Scheduled</h3>
          <button className="next-job-card" onClick={() => onNavigate('jobs')}>
            <span className="next-job-status" />
            <div className="next-job-info">
              <span className="next-job-name">{nextJob.name}</span>
              <span className="next-job-desc">{nextJob.description}</span>
            </div>
            <span className="next-job-time">{formatNextRun(nextJob.nextRun)}</span>
          </button>
        </div>
      )}

      {favCaps.length > 0 && (
        <div className="dash-section">
          <h3 className="dash-section-title">Favourites</h3>
          <div className="fav-list">
            {favCaps.map((cap) => {
              const isOpen = expandedFav === cap.name;
              return (
                <div
                  key={cap.name}
                  className={`fav-card ${isOpen ? 'expanded' : ''}`}
                  onClick={() => toggleExpand(cap.name)}
                >
                  <div className="fav-card-header">
                    <span className="fav-icon">{cap.categoryIcon}</span>
                    <div className="fav-info">
                      <span className="fav-name">{cap.name}</span>
                      {!isOpen && (
                        <span className="fav-desc">{cap.description}</span>
                      )}
                    </div>
                    <span className={`fav-chevron ${isOpen ? 'open' : ''}`}>›</span>
                  </div>
                  {isOpen && <FavDetail cap={cap} />}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {(data.wip || []).filter(isWipActive).length > 0 && (
        <div className="dash-section">
          <h3 className="dash-section-title">Active Development</h3>
          <div className="fav-list">
            {data.wip
              .filter(isWipActive)
              .map((w) => (
                <button
                  key={w.name}
                  className="fav-card"
                  onClick={() => onNavigate('wip')}
                >
                  <span className="fav-icon">🚧</span>
                  <div className="fav-info">
                    <span className="fav-name">{w.name}</span>
                    <span className="fav-desc">{w.note || w.summary || w.description}</span>
                  </div>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
