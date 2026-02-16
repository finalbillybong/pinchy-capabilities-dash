import React from 'react';
import './Footer.css';

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

export default function Footer({ meta }) {
  if (!meta) return null;

  return (
    <footer className="footer">
      <span className="footer-text">
        Updated: {timeAgo(meta.lastUpdated)}
      </span>
      <span className="footer-sep">·</span>
      <span className="footer-text">v{meta.version}</span>
    </footer>
  );
}
