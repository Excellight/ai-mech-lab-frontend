import React from 'react';
import { useMechLab } from '../context/MechLabContext';

export default function NotificationsScreen({ active }) {
  const {
    navTo,
    unreadNotifications,
    markAllNotificationsRead,
    showToast,
  } = useMechLab();

  return (
    <section className={`screen${active ? ' show' : ''}`} id="notifications">
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
        <h1>Notifications</h1>
        <button
          className="chip"
          id="mr"
          type="button"
          onClick={() => {
            markAllNotificationsRead();
            showToast('All marked as read');
          }}
        >
          Mark all read
        </button>
      </div>
      <div className="card">
        <div className="row" onClick={() => navTo('project')}>
          <div className="ti" style={{ background: '#DDF5E3' }}>
            🧪
          </div>
          <div>
            Lab reminder: PID Control Lab is due Oct 9<small>2h ago</small>
          </div>
          {unreadNotifications && <i className="ud" />}
        </div>
        <div className="row" onClick={() => navTo('profile')}>
          <div className="ti" style={{ background: '#FFF0C7' }}>
            🏆
          </div>
          <div>
            You earned Circuit Master<small>Yesterday</small>
          </div>
          {unreadNotifications && <i className="ud" />}
        </div>
        <div className="row" onClick={() => navTo('community')}>
          <div className="ti" style={{ background: '#DCE8FF' }}>
            💬
          </div>
          <div>
            Amaka K. replied to your question<small>Yesterday</small>
          </div>
        </div>
        <div className="row" onClick={() => navTo('quizzes')}>
          <div className="ti" style={{ background: '#EADFFF' }}>
            📝
          </div>
          <div>
            Quiz: AI Algorithms opens Oct 12<small>2 days ago</small>
          </div>
        </div>
        <div className="row" onClick={() => navTo('projects')}>
          <div className="ti" style={{ background: 'var(--tile)' }}>
            🚧
          </div>
          <div>
            New project unlocked: Temperature Alarm<small>3 days ago</small>
          </div>
        </div>
      </div>
    </section>
  );
}
