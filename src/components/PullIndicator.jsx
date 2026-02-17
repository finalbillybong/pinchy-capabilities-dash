import React from 'react';
import './PullIndicator.css';

const THRESHOLD = 80;

export default function PullIndicator({ pullDistance, refreshing }) {
  if (pullDistance <= 0 && !refreshing) return null;

  const ready = pullDistance >= THRESHOLD;
  const rotation = Math.min((pullDistance / THRESHOLD) * 360, 360);

  return (
    <div
      className="pull-indicator"
      style={{ transform: `translateY(${pullDistance}px)` }}
    >
      <span
        className={`pull-icon ${refreshing ? 'spinning' : ''}`}
        style={!refreshing ? { transform: `rotate(${rotation}deg)` } : undefined}
      >
        {ready || refreshing ? '🦀' : '↓'}
      </span>
    </div>
  );
}
