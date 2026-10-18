import React, { useState } from 'react';
import { useMechLab } from '../context/MechLabContext';

export default function MessagesScreen({ active }) {
  const { navTo, setThreadMeta } = useMechLab();
  const [searchQuery, setSearchQuery] = useState('');

  const threads = [
    {
      name: 'Amaka K.',
      avatar: 'AK',
      preview: 'Thanks! The P value fix worked.',
      time: '10m',
      badge: '2',
    },
    {
      name: 'Tunde O.',
      avatar: 'TO',
      preview: 'Want to team up on the maze game?',
      time: '1h',
      badge: null,
    },
    {
      name: 'Robotics study group',
      avatar: 'RG',
      preview: 'Next meetup is Saturday.',
      time: 'Yesterday',
      badge: null,
    },
    {
      name: 'Mech Bot',
      avatar: 'MB',
      preview: 'Your weekly summary is ready.',
      time: '2d',
      badge: null,
    },
  ];

  const q = searchQuery.trim().toLowerCase();
  const filtered = threads.filter(
    (t) =>
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.preview.toLowerCase().includes(q)
  );

  const handleOpenThread = (t) => {
    setThreadMeta((prev) => ({
      ...prev,
      name: t.name,
      avatar: t.avatar,
    }));
    navTo('thread');
  };

  return (
    <section className={`screen${active ? ' show' : ''}`} id="messages">
      <div className="hdr">
        <a
          className="back"
          href="#dash"
          aria-label="Back"
          onClick={(e) => {
            e.preventDefault();
            navTo('dash');
          }}
        >
          ←
        </a>
        <h1>Messages</h1>
      </div>
      <input
        className="f"
        type="search"
        placeholder="Search messages"
        aria-label="Search messages"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="card">
        {filtered.map((t) => (
          <div
            className="row"
            key={t.name}
            onClick={() => handleOpenThread(t)}
          >
            <div className="av2">{t.avatar}</div>
            <div>
              <b>{t.name}</b>
              <small>{t.preview}</small>
            </div>
            <time>{t.time}</time>
            {t.badge && <span className="bdg">{t.badge}</span>}
          </div>
        ))}
      </div>
    </section>
  );
}
