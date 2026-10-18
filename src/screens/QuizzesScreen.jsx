import React from 'react';
import { useMechLab } from '../context/MechLabContext';

export default function QuizzesScreen({ active }) {
  const { navTo, openQuizDeck } = useMechLab();

  return (
    <section className={`screen${active ? ' show' : ''}`} id="quizzes">
      <div className="hdr">
        <h1>Practice</h1>
      </div>
      <div className="chips">
        <button
          className="chip"
          type="button"
          aria-pressed="false"
          onClick={() => navTo('lab')}
        >
          AI Lab
        </button>
        <button
          className="chip"
          type="button"
          aria-pressed="true"
          onClick={() => navTo('quizzes')}
        >
          Quizzes
        </button>
        <button
          className="chip"
          type="button"
          aria-pressed="false"
          onClick={() => navTo('games')}
        >
          Games
        </button>
      </div>
      <div className="card" style={{ marginBottom: '12px' }}>
        <h2>Daily quiz</h2>
        <p className="meta">5 questions · +50 XP</p>
        <button
          className="btn"
          type="button"
          onClick={() => openQuizDeck('daily')}
        >
          Start daily quiz
        </button>
      </div>
      <h2 style={{ margin: '6px 0 10px' }}>All quizzes</h2>
      <div className="card">
        <div className="row" onClick={() => openQuizDeck('sensors')}>
          <div className="ti" style={{ background: '#DDF5E3' }}>
            📝
          </div>
          <div>
            Sensors Quiz<small>10 questions · ADC &amp; Ultrasonic</small>
          </div>
          <time>90%</time>
        </div>
        <div className="row" onClick={() => openQuizDeck('pid')}>
          <div className="ti" style={{ background: '#DCE8FF' }}>
            ❓
          </div>
          <div>
            PID Basics<small>8 questions · Control Systems</small>
          </div>
          <time>Start</time>
        </div>
        <div className="row" onClick={() => openQuizDeck('ai')}>
          <div className="ti" style={{ background: '#EADFFF' }}>
            🗓️
          </div>
          <div>
            AI Algorithms<small>12 questions · Python, NumPy &amp; ML</small>
          </div>
          <time>Oct 12</time>
        </div>
        <div className="row" onClick={() => openQuizDeck('circuits')}>
          <div className="ti" style={{ background: '#DDF5E3' }}>
            📝
          </div>
          <div>
            Circuits Quiz<small>10 questions · Ohm&apos;s Law &amp; LEDs</small>
          </div>
          <time>85%</time>
        </div>
      </div>
    </section>
  );
}
