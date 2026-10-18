import React from 'react';
import { useMechLab } from '../context/MechLabContext';

export default function AppearanceScreen({ active }) {
  const {
    navTo,
    themePref,
    setThemePref,
    textSize,
    setTextSize,
    reduceMotion,
    setReduceMotion,
  } = useMechLab();

  return (
    <section className={`screen${active ? ' show' : ''}`} id="appearance">
      <div className="hdr">
        <a
          className="back"
          href="#profile"
          aria-label="Back"
          onClick={(e) => {
            e.preventDefault();
            navTo('profile');
          }}
        >
          ←
        </a>
        <h1>Appearance</h1>
      </div>
      <p className="lab">Theme</p>
      <div className="chips">
        <button
          className="chip"
          type="button"
          data-th="system"
          aria-pressed={themePref === 'system' ? 'true' : 'false'}
          onClick={() => setThemePref('system')}
        >
          System
        </button>
        <button
          className="chip"
          type="button"
          data-th="light"
          aria-pressed={themePref === 'light' ? 'true' : 'false'}
          onClick={() => setThemePref('light')}
        >
          Light
        </button>
        <button
          className="chip"
          type="button"
          data-th="dark"
          aria-pressed={themePref === 'dark' ? 'true' : 'false'}
          onClick={() => setThemePref('dark')}
        >
          Dark
        </button>
      </div>
      <p className="lab">Text size</p>
      <div className="chips">
        <button
          className="chip"
          type="button"
          data-sz="15"
          aria-pressed={textSize === 15 ? 'true' : 'false'}
          onClick={() => setTextSize(15)}
        >
          Small
        </button>
        <button
          className="chip"
          type="button"
          data-sz="16"
          aria-pressed={textSize === 16 ? 'true' : 'false'}
          onClick={() => setTextSize(16)}
        >
          Medium
        </button>
        <button
          className="chip"
          type="button"
          data-sz="18"
          aria-pressed={textSize === 18 ? 'true' : 'false'}
          onClick={() => setTextSize(18)}
        >
          Large
        </button>
      </div>
      <div className="card">
        <div className="set" style={{ paddingTop: 0, border: 0 }}>
          Reduce motion{' '}
          <button
            className="sw"
            id="rm"
            type="button"
            role="switch"
            aria-checked={reduceMotion ? 'true' : 'false'}
            aria-label="Reduce motion"
            onClick={() => setReduceMotion((v) => !v)}
          />
        </div>
      </div>
    </section>
  );
}
