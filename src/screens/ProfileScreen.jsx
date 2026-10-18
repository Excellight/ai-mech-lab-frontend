import React from 'react';
import { useMechLab } from '../context/MechLabContext';

export default function ProfileScreen({ active }) {
  const { navTo, learnerStats } = useMechLab();

  const xpPct = Math.min(100, Math.round((learnerStats.xp / 2000) * 100));

  return (
    <section className={`screen${active ? ' show' : ''}`} id="profile">
      <div className="pf">
        <div className="av2">ML</div>
        <h1 style={{ margin: 0 }}>Mech Learner</h1>
        <p className="sub">
          Level {learnerStats.level} · {learnerStats.xp.toLocaleString()} / 2,000 XP
        </p>
        <div className="bar">
          <i style={{ width: `${xpPct}%` }} />
        </div>
      </div>
      <div
        className="stats"
        style={{
          marginTop: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)'
        }}
      >
        <div className="stat">
          <span>Labs</span>
          <b>{learnerStats.labsCompleted}</b>
        </div>
        <div className="stat">
          <span>Quiz score</span>
          <b>{learnerStats.quizScoreAvg}%</b>
        </div>
        <div className="stat">
          <span>Streak</span>
          <b>{learnerStats.streakDays} 🔥</b>
        </div>
      </div>
      <h2 style={{ margin: '18px 0 4px' }}>Achievements</h2>
      <p className="meta" style={{ margin: '0 0 10px' }}>
        {learnerStats.achievementsCount} earned · 61 ⭐ collected
      </p>
      <div className="ach">
        <div className="ac">
          <i>🏆</i>
          <b>Circuit Master</b>
          <small>Finish 10 labs</small>
        </div>
        <div className="ac">
          <i>⭐</i>
          <b>First Lab</b>
          <small>Earned</small>
        </div>
        <div className="ac">
          <i>🌟</i>
          <b>Quiz Ace</b>
          <small>Score 90%+</small>
        </div>
        <div className="ac">
          <i>🏆</i>
          <b>Robot Builder</b>
          <small>Earned</small>
        </div>
        <div className="ac">
          <i>⭐</i>
          <b>5-Day Streak</b>
          <small>Earned</small>
        </div>
        <div className={`ac${learnerStats.achievementsCount >= 25 ? '' : ' off'}`}>
          <i>🏆</i>
          <b>AI Pioneer</b>
          <small>{learnerStats.achievementsCount >= 25 ? 'Earned' : 'Locked'}</small>
        </div>
      </div>
      <div className="card" style={{ marginTop: '16px' }}>
        <a
          className="set"
          href="#messages"
          style={{ border: 0 }}
          onClick={(e) => {
            e.preventDefault();
            navTo('messages');
          }}
        >
          Messages <span>›</span>
        </a>
        <a
          className="set"
          href="#notifications"
          onClick={(e) => {
            e.preventDefault();
            navTo('notifications');
          }}
        >
          Notifications <span>›</span>
        </a>
        <a
          className="set"
          href="#appearance"
          onClick={(e) => {
            e.preventDefault();
            navTo('appearance');
          }}
        >
          Appearance <span>›</span>
        </a>
        <a
          className="set"
          href="#settings"
          onClick={(e) => {
            e.preventDefault();
            navTo('settings');
          }}
        >
          Settings <span>›</span>
        </a>
        <a
          className="set"
          href="#auth"
          onClick={(e) => {
            e.preventDefault();
            navTo('auth');
          }}
        >
          Log out <span>›</span>
        </a>
      </div>
    </section>
  );
}
