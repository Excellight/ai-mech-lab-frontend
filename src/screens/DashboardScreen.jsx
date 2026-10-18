import React, { useState } from 'react';
import { useMechLab } from '../context/MechLabContext';
import { ASSETS } from '../data/brandAssets';
import GenerateTrackBar from '../components/shared/GenerateTrackBar';

export default function DashboardScreen({ active }) {
  const {
    navTo,
    isDark,
    toggleDarkLight,
    selectTrackByTitleOrKey,
    unreadNotifications,
    learnerStats,
    customCourses,
    activityFeed,
    tracks
  } = useMechLab();
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenCourse = (titleOrKey) => {
    selectTrackByTitleOrKey('course', titleOrKey);
    navTo('course');
  };

  const handleOpenProject = (titleOrKey) => {
    selectTrackByTitleOrKey('project', titleOrKey);
    navTo('project');
  };

  const q = searchQuery.trim().toLowerCase();
  const matches = (text) => !q || text.toLowerCase().includes(q);

  const aiDone = tracks?.ai?.a ?? 4;
  const aiTotal = tracks?.ai?.s?.length ?? 11;
  const aiPct = Math.round((aiDone / Math.max(1, aiTotal)) * 100);

  const obstDone = tracks?.obstacle?.a ?? 2;
  const obstTotal = tracks?.obstacle?.s?.length ?? 6;
  const obstPct = Math.max(40, Math.round((obstDone / Math.max(1, obstTotal)) * 100));

  return (
    <main className={`screen${active ? ' show' : ''}`} id="dash">
      <div className="top">
        <div className="brand">
          <img src={ASSETS.BRAND_LOGO_SMALL} alt="" />
          AI MECH LAB
        </div>
        <input
          className="search"
          type="search"
          placeholder="Search courses, topics..."
          aria-label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="tr">
          <button
            className="ic thm"
            type="button"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={toggleDarkLight}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          <button
            className="ic"
            type="button"
            aria-label="Messages"
            onClick={() => navTo('messages')}
          >
            💬
          </button>
          <button
            className={`ic${unreadNotifications ? ' dot' : ''}`}
            type="button"
            aria-label="Notifications"
            onClick={() => navTo('notifications')}
          >
            🔔
          </button>
          <button
            className="ic"
            type="button"
            aria-label="Settings"
            onClick={() => navTo('settings')}
          >
            ⚙️
          </button>
        </div>
      </div>

      <h1>Welcome back, Mech Learner! 👋</h1>
      <p className="sub">
        Continue learning. Build intelligent machines. ·{' '}
        <b>{learnerStats.xp.toLocaleString()} XP</b> ·{' '}
        <b>{learnerStats.streakDays} 🔥 streak</b>
      </p>
      <GenerateTrackBar />

      <div className="stats">
        <div className="stat">
          <div className="si" style={{ background: '#DCE8FF' }}>
            📖
          </div>
          <span>Courses enrolled</span>
          <b>{12 + (customCourses?.length || 0)}</b>
          <i className="up">↑ 2 this month</i>
        </div>
        <div className="stat">
          <div className="si" style={{ background: '#D2F5FB' }}>
            🧪
          </div>
          <span>Labs completed</span>
          <b>{learnerStats.labsCompleted}</b>
          <i className="up">↑ 4 this month</i>
        </div>
        <div className="stat">
          <div className="si" style={{ background: '#EADFFF' }}>
            📊
          </div>
          <span>Quiz score</span>
          <b>{learnerStats.quizScoreAvg}%</b>
          <i className="up">↑ 8% this month</i>
        </div>
        <div className="stat">
          <div className="si" style={{ background: '#FFF0C7' }}>
            🏆
          </div>
          <span>Achievements</span>
          <b>{learnerStats.achievementsCount}</b>
          <a
            className="up"
            href="#profile"
            style={{ color: 'var(--blue)', textDecoration: 'none' }}
            onClick={(e) => {
              e.preventDefault();
              navTo('profile');
            }}
          >
            View all
          </a>
        </div>
      </div>

      <div className="grid">
        <section className="card c">
          <div className="hd">
            <h2>Continue learning</h2>
            <a
              href="#courses"
              onClick={(e) => {
                e.preventDefault();
                navTo('courses');
              }}
            >
              View all courses →
            </a>
          </div>
          <div className="courses">
            {matches('Robotics Fundamentals Learn the basics of robots and their components.') && (
              <div className="course">
                <div className="ct">
                  <img src={ASSETS.COURSE_ROBOTICS} alt="Robotic arm" />
                </div>
                <div className="cb">
                  <h3>Robotics Fundamentals</h3>
                  <p>Learn the basics of robots and their components.</p>
                  <div className="bar">
                    <i style={{ width: '65%' }} />
                  </div>
                  <div className="cf">
                    <span className="meta">6 / 10 lessons</span>
                    <button
                      className="go"
                      type="button"
                      onClick={() => handleOpenCourse('Robotics Fundamentals')}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            )}
            {matches('Artificial Intelligence Basics Understand AI concepts and applications.') && (
              <div className="course">
                <div className="ct">
                  <img src={ASSETS.COURSE_AI} alt="AI brain" />
                </div>
                <div className="cb">
                  <h3>Artificial Intelligence Basics</h3>
                  <p>Understand AI concepts and applications.</p>
                  <div className="bar">
                    <i style={{ width: `${aiPct}%` }} />
                  </div>
                  <div className="cf">
                    <span className="meta">
                      {aiDone} / {aiTotal} lessons
                    </span>
                    <button
                      className="go"
                      type="button"
                      onClick={() =>
                        handleOpenCourse('Artificial Intelligence Basics')
                      }
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            )}
            {matches('Microcontrollers 101 Get started with Arduino and embedded systems.') && (
              <div className="course">
                <div className="ct">
                  <img src={ASSETS.COURSE_MICRO} alt="Microcontroller board" />
                </div>
                <div className="cb">
                  <h3>Microcontrollers 101</h3>
                  <p>Get started with Arduino and embedded systems.</p>
                  <div className="bar">
                    <i style={{ width: '30%' }} />
                  </div>
                  <div className="cf">
                    <span className="meta">3 / 10 lessons</span>
                    <button
                      className="go"
                      type="button"
                      onClick={() => handleOpenCourse('Microcontrollers 101')}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="card">
          <div className="hd">
            <h2>Continue projects</h2>
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                navTo('projects');
              }}
            >
              View all projects →
            </a>
          </div>
          <div className="courses">
            {matches('Obstacle-Avoiding Robot Ultrasonic sensor Intermediate') && (
              <div className="course">
                <div
                  className="ct"
                  style={{
                    background: 'var(--tile)',
                    display: 'grid',
                    placeItems: 'center',
                    aspectRatio: '3/2',
                    fontSize: '2.4rem'
                  }}
                >
                  🚧
                </div>
                <div className="cb">
                  <h3>Obstacle-Avoiding Robot</h3>
                  <p>Ultrasonic sensor · Intermediate</p>
                  <div className="bar">
                    <i style={{ width: `${obstPct}%` }} />
                  </div>
                  <div className="cf">
                    <span className="meta">
                      Step {Math.min(obstDone + 1, obstTotal)} of {obstTotal}
                    </span>
                    <button
                      className="go"
                      type="button"
                      onClick={() =>
                        handleOpenProject('Obstacle-Avoiding Robot')
                      }
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            )}
            {matches('Temperature Alarm Microcontroller Beginner') && (
              <div className="course">
                <div
                  className="ct"
                  style={{
                    background: 'var(--tile)',
                    display: 'grid',
                    placeItems: 'center',
                    aspectRatio: '3/2',
                    fontSize: '2.4rem'
                  }}
                >
                  🌡️
                </div>
                <div className="cb">
                  <h3>Temperature Alarm</h3>
                  <p>Microcontroller · Beginner</p>
                  <div className="bar">
                    <i style={{ width: '0%' }} />
                  </div>
                  <div className="cf">
                    <span className="meta">0 / 5 steps</span>
                    <button
                      className="go"
                      type="button"
                      onClick={() => handleOpenProject('Temperature Alarm')}
                    >
                      Start
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="card a">
          <div className="hd">
            <h2>Recent activity</h2>
            <a
              href="#activity"
              onClick={(e) => {
                e.preventDefault();
                navTo('activity');
              }}
            >
              View all
            </a>
          </div>
          {(activityFeed || []).slice(0, 4).map((item) =>
            matches(`${item.title} ${item.time}`) ? (
              <div key={item.id} className="row">
                <div className="ti" style={{ background: item.bg }}>
                  {item.icon}
                </div>
                <div>{item.title}</div>
                <time>{item.time}</time>
              </div>
            ) : null
          )}
        </section>

        <section className="card t">
          <div className="hd">
            <h2>Upcoming tasks</h2>
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                navTo('projects');
              }}
            >
              View all
            </a>
          </div>
          {matches('Complete PID Control Lab Robotics Fundamentals Oct 9') && (
            <div className="row">
              <div className="ti" style={{ background: 'var(--tile)' }}>
                🗓️
              </div>
              <div>
                Complete PID Control Lab<small>Robotics Fundamentals</small>
              </div>
              <time>Oct 9</time>
            </div>
          )}
          {matches('Quiz: AI Algorithms Artificial Intelligence Basics Oct 12') && (
            <div className="row">
              <div className="ti" style={{ background: 'var(--tile)' }}>
                🗓️
              </div>
              <div>
                Quiz: AI Algorithms<small>Artificial Intelligence Basics</small>
              </div>
              <time>Oct 12</time>
            </div>
          )}
          {matches('Project: Obstacle-Avoiding Robot Robotics Fundamentals Oct 16') && (
            <div className="row">
              <div className="ti" style={{ background: 'var(--tile)' }}>
                🗓️
              </div>
              <div>
                Project: Obstacle-Avoiding Robot<small>Robotics Fundamentals</small>
              </div>
              <time>Oct 16</time>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
