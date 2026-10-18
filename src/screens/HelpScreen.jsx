import React from 'react';
import { useMechLab } from '../context/MechLabContext';

export default function HelpScreen({ active }) {
  const { navTo } = useMechLab();

  return (
    <section className={`screen${active ? ' show' : ''}`} id="help">
      <div className="hdr">
        <a
          className="back"
          href="#settings"
          aria-label="Back"
          onClick={(e) => {
            e.preventDefault();
            navTo('settings');
          }}
        >
          ←
        </a>
        <h1>Help and support</h1>
      </div>
      <div className="card">
        <details>
          <summary>How do I continue a course?</summary>
          <p>
            Open Learn, tap Continue on a course, then tap the glowing station
            on its track.
          </p>
        </details>
        <details>
          <summary>What are MechTracks?</summary>
          <p>
            A MechTrack is the pathway for a course or project, from start to
            finish.
          </p>
        </details>
        <details>
          <summary>How do I earn XP?</summary>
          <p>
            Finish lessons, quizzes, games and projects to earn XP and level up.
          </p>
        </details>
        <details>
          <summary>How do I reset my password?</summary>
          <p>
            On the log in page, use Forgot password, or message support below.
          </p>
        </details>
      </div>
      <button className="btn" type="button" onClick={() => navTo('messages')}>
        Message support
      </button>
    </section>
  );
}
