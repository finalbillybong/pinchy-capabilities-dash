import React from 'react';
import { getNextRun, formatNextRun } from '../utils/cronNext';
import './CronList.css';

export default function CronList({ jobs }) {
  if (!jobs?.length) {
    return <p className="empty-msg">No scheduled jobs configured.</p>;
  }

  return (
    <div className="cron-list">
      <h2 className="section-title">⏰ Scheduled Jobs</h2>
      <div className="cron-cards">
        {jobs.map((job) => {
          const nextRun = job.status === 'active' ? getNextRun(job.schedule) : null;
          const nextStr = formatNextRun(nextRun);

          return (
            <div key={job.name} className="cron-card">
              <div className="cron-top">
                <span
                  className={`cron-status ${job.status === 'active' ? 'active' : 'paused'}`}
                  title={job.status}
                />
                <span className="cron-name">{job.name}</span>
              </div>
              <div className="cron-schedule-row">
                <span className="cron-schedule">{job.schedule}</span>
                {nextStr && (
                  <span className="cron-next">Next: {nextStr}</span>
                )}
              </div>
              {job.description && (
                <p className="cron-desc">{job.description}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
