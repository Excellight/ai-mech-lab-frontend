import React from 'react';
import { useMechLab } from '../context/MechLabContext';

export default function GamesScreen({ active }) {
  const { navTo, setGameMeta } = useMechLab();

  const handlePlayGame = (title, desc) => {
    setGameMeta({
      title,
      subtitle: `Quick round: ${desc.toLowerCase()}. Tap the targets for 15 seconds.`,
    });
    navTo('game');
  };

  return (
    <section className={`screen${active ? ' show' : ''}`} id="games">
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
          aria-pressed="false"
          onClick={() => navTo('quizzes')}
        >
          Quizzes
        </button>
        <button
          className="chip"
          type="button"
          aria-pressed="true"
          onClick={() => navTo('games')}
        >
          Games
        </button>
      </div>
      <div className="g2">
        <div className="tile">
          <i>🧩</i>
          <b>Circuit Builder</b>
          <br />
          Connect the parts to light the LED
          <br />
          <small className="meta">Best: 1,240</small>
          <button
            className="go"
            type="button"
            style={{ marginTop: '8px', width: '100%' }}
            onClick={() =>
              handlePlayGame(
                'Circuit Builder',
                'Connect the parts to light the LED'
              )
            }
          >
            Play
          </button>
        </div>
        <div className="tile">
          <i>🗺️</i>
          <b>Robot Maze</b>
          <br />
          Program a robot out of the maze
          <br />
          <small className="meta">Best: 860</small>
          <button
            className="go"
            type="button"
            style={{ marginTop: '8px', width: '100%' }}
            onClick={() =>
              handlePlayGame('Robot Maze', 'Program a robot out of the maze')
            }
          >
            Play
          </button>
        </div>
        <div className="tile">
          <i>🐞</i>
          <b>Bug Hunt</b>
          <br />
          Find the bug in the code
          <br />
          <small className="meta">Best: 540</small>
          <button
            className="go"
            type="button"
            style={{ marginTop: '8px', width: '100%' }}
            onClick={() => handlePlayGame('Bug Hunt', 'Find the bug in the code')}
          >
            Play
          </button>
        </div>
        <div className="tile">
          <i>⚡</i>
          <b>Sensor Rush</b>
          <br />
          Tap fast when the sensor fires
          <br />
          <small className="meta">Best: 2,100</small>
          <button
            className="go"
            type="button"
            style={{ marginTop: '8px', width: '100%' }}
            onClick={() =>
              handlePlayGame('Sensor Rush', 'Tap fast when the sensor fires')
            }
          >
            Play
          </button>
        </div>
      </div>
      <div className="card" style={{ marginTop: '12px' }}>
        <h2 style={{ marginBottom: '8px' }}>Leaderboard</h2>
        <div className="row">
          <div className="ti" style={{ background: '#FFF0C7' }}>
            🥇
          </div>
          <div>Tunde O.</div>
          <time>4,820 XP</time>
        </div>
        <div className="row">
          <div className="ti" style={{ background: 'var(--tile)' }}>
            🥈
          </div>
          <div>
            <b>You</b>
          </div>
          <time>4,310 XP</time>
        </div>
        <div className="row">
          <div className="ti" style={{ background: 'var(--tile)' }}>
            🥉
          </div>
          <div>Amaka K.</div>
          <time>4,050 XP</time>
        </div>
      </div>
    </section>
  );
}
