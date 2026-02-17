import React, { useState, useMemo } from 'react';
import { useCapabilities } from './hooks/useCapabilities';
import { usePullToRefresh } from './hooks/usePullToRefresh';
import { useFavourites } from './hooks/useFavourites';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CategoryCard from './components/CategoryCard';
import CronList from './components/CronList';
import IntegrationList from './components/IntegrationList';
import WipList from './components/WipList';
import Dashboard from './components/Dashboard';
import PullIndicator from './components/PullIndicator';
import Footer from './components/Footer';
import './styles/App.css';

const SECTIONS = ['home', 'capabilities', 'jobs', 'integrations', 'wip'];

export default function App() {
  const { data, error, loading, refetch } = useCapabilities();
  const { pulling, pullDistance, refreshing } = usePullToRefresh(refetch);
  const { favourites, toggle: toggleFav, isFav } = useFavourites();
  const [search, setSearch] = useState('');
  const [activeSection, setActiveSection] = useState('capabilities');
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('pinchy-theme') || 'dark';
    }
    return 'dark';
  });

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('pinchy-theme', next);
  };

  // Apply theme
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
  }

  // Filter categories by search
  const filteredCategories = useMemo(() => {
    if (!data?.categories) return [];
    if (!search.trim()) return data.categories;

    const q = search.toLowerCase();
    return data.categories
      .map((cat) => {
        const catMatch = cat.name.toLowerCase().includes(q);
        const filtered = cat.capabilities.filter(
          (cap) =>
            catMatch ||
            cap.name.toLowerCase().includes(q) ||
            cap.description.toLowerCase().includes(q) ||
            cap.triggers?.some((t) => t.toLowerCase().includes(q)) ||
            cap.examples?.some((e) => e.toLowerCase().includes(q))
        );
        if (filtered.length === 0) return null;
        return { ...cat, capabilities: filtered };
      })
      .filter(Boolean);
  }, [data?.categories, search]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-crab">🦀</div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="loading-screen">
        <div className="loading-crab">😵</div>
        <p>Failed to load capabilities</p>
        <p className="error-detail">{error}</p>
      </div>
    );
  }

  return (
    <div className="app">
      <PullIndicator pullDistance={pullDistance} refreshing={refreshing} />
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <nav className="section-nav">
        {SECTIONS.map((s) => (
          <button
            key={s}
            className={`nav-pill ${activeSection === s ? 'active' : ''}`}
            onClick={() => setActiveSection(s)}
          >
            {s === 'home' && '🏠'}
            {s === 'capabilities' && '📋'}
            {s === 'jobs' && '⏰'}
            {s === 'integrations' && '🔌'}
            {s === 'wip' && '🚧'}
            <span className="nav-label">
              {s === 'home'
                ? 'Home'
                : s === 'capabilities'
                  ? 'Capabilities'
                  : s === 'jobs'
                    ? 'Jobs'
                    : s === 'integrations'
                      ? 'Integrations'
                      : 'WIP'}
            </span>
          </button>
        ))}
      </nav>

      {activeSection === 'capabilities' && (
        <SearchBar value={search} onChange={setSearch} />
      )}

      <main className="main-content">
        {activeSection === 'home' && (
          <section className="section">
            <Dashboard
              data={data}
              favourites={favourites}
              onNavigate={setActiveSection}
            />
          </section>
        )}

        {activeSection === 'capabilities' && (
          <section className="section">
            {filteredCategories.length === 0 ? (
              <div className="empty-state">
                <p>No capabilities match "{search}"</p>
              </div>
            ) : (
              filteredCategories.map((cat) => (
                <CategoryCard
                  key={cat.name}
                  category={cat}
                  isFav={isFav}
                  onToggleFav={toggleFav}
                />
              ))
            )}
          </section>
        )}

        {activeSection === 'jobs' && (
          <section className="section">
            <CronList jobs={data.cronJobs} />
          </section>
        )}

        {activeSection === 'integrations' && (
          <section className="section">
            <IntegrationList integrations={data.integrations} />
          </section>
        )}

        {activeSection === 'wip' && (
          <section className="section">
            <WipList items={data.wip} />
          </section>
        )}
      </main>

      <Footer meta={data.meta} />
    </div>
  );
}
