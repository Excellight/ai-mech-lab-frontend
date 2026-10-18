import React from 'react';
import { useMechLab } from '../../context/MechLabContext';

export default function BottomNav() {
  const { activeNavTab, navTo } = useMechLab();

  const handleNav = (e, target) => {
    e.preventDefault();
    navTo(target);
  };

  return (
    <nav aria-label="Main">
      <a
        href="#dash"
        className="fl"
        aria-current={activeNavTab === 'dash' ? 'page' : undefined}
        onClick={(e) => handleNav(e, 'dash')}
      >
        <svg viewBox="0 0 24 24">
          <path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
        </svg>
        Dashboard
      </a>
      <a
        href="#courses"
        aria-current={activeNavTab === 'courses' ? 'page' : undefined}
        onClick={(e) => handleNav(e, 'courses')}
      >
        <svg viewBox="0 0 24 24">
          <path d="M12 6C9.5 4.5 6 4 3 4v13c3 0 5.5.4 7.5 1.5M12 6v5M12 6c2.5-1.5 6-2 9-2v6" />
          <circle cx="17.5" cy="17.5" r="3.2" style={{ fill: 'var(--card)' }} />
          <path d="M17.5 12.8v1.3M17.5 20.9v1.3M12.8 17.5h1.3M20.9 17.5h1.3" />
        </svg>
        Learn
      </a>
      <a
        href="#lab"
        aria-current={activeNavTab === 'lab' ? 'page' : undefined}
        onClick={(e) => handleNav(e, 'lab')}
      >
        <svg viewBox="0 0 24 24">
          <path d="M7 7.5h10a5 5 0 0 1 5 5v1.5a3 3 0 0 1-5.3 1.9L15 14.5H9l-1.7 1.9A3 3 0 0 1 2 14v-1.5a5 5 0 0 1 5-5z" />
          <path d="M8 10v3M6.5 11.5h3" />
          <circle cx="15.5" cy="11" r=".6" />
          <circle cx="17.5" cy="12.8" r=".6" />
        </svg>
        Practice
      </a>
      <a
        href="#community"
        aria-current={activeNavTab === 'community' ? 'page' : undefined}
        onClick={(e) => handleNav(e, 'community')}
      >
        <svg viewBox="0 0 24 24">
          <circle cx="9" cy="8" r="3" />
          <path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M16 5.2a3 3 0 0 1 0 5.6M18 14.8c1.8.7 3 2.3 3 5.2" />
        </svg>
        Community
      </a>
      <a
        href="#profile"
        aria-current={activeNavTab === 'profile' ? 'page' : undefined}
        onClick={(e) => handleNav(e, 'profile')}
      >
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
        </svg>
        Profile
      </a>
    </nav>
  );
}
