import React from 'react';
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

export default function Dashboard({ data, favourites, onNavigate }) {
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
  const wipActive = (data.wip || []).filter(
    (w) => w.status === 'in_progress'
  ).length;

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
            {favCaps.map((cap) => (
              <button
                key={cap.name}
                className="fav-card"
                onClick={() => onNavigate('capabilities')}
              >
                <span className="fav-icon">{cap.categoryIcon}</span>
                <div className="fav-info">
                  <span className="fav-name">{cap.name}</span>
                  <span className="fav-desc">{cap.description}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {(data.wip || []).filter((w) => w.status === 'in_progress').length > 0 && (
        <div className="dash-section">
          <h3 className="dash-section-title">Active Development</h3>
          <div className="fav-list">
            {data.wip
              .filter((w) => w.status === 'in_progress')
              .map((w) => (
                <button
                  key={w.name}
                  className="fav-card"
                  onClick={() => onNavigate('wip')}
                >
                  <span className="fav-icon">🚧</span>
                  <div className="fav-info">
                    <span className="fav-name">{w.name}</span>
                    <span className="fav-desc">{w.note || w.description}</span>
                  </div>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
