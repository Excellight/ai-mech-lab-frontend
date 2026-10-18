import React from 'react';
import { useMechLab } from '../context/MechLabContext';

export default function ActivityScreen({ active }) {
  const { navTo, activityFeed } = useMechLab();

  return (
    <section className={`screen${active ? ' show' : ''}`} id="activity">
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
        <h1>Activity</h1>
      </div>
      <div className="card">
        {(activityFeed || []).map((item) => (
          <div key={item.id} className="row">
            <div className="ti" style={{ background: item.bg }}>
              {item.icon}
            </div>
            <div>
              {item.title}
              <small>{item.category}</small>
            </div>
            <time>{item.time}</time>
          </div>
        ))}
      </div>
    </section>
  );
}
