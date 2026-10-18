import React, { useState, useEffect } from 'react';
import { useMechLab } from '../../context/MechLabContext';

const PHRASES = ['Find a course', 'What are you building today?'];

export default function GenerateTrackBar() {
  const { reduceMotion, openBotWithPrompt, navTo } = useMechLab();
  const [inputVal, setInputVal] = useState('');
  const [focused, setFocused] = useState(false);
  const [placeholderText, setPlaceholderText] = useState('');

  useEffect(() => {
    let phraseIdx = 0;
    let charIdx = 0;
    let direction = 1;
    let timerId = null;

    const tick = () => {
      const s = PHRASES[phraseIdx];
      const prefersReduced =
        reduceMotion ||
        (window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches);

      if (prefersReduced) {
        setPlaceholderText(s);
        phraseIdx = (phraseIdx + 1) % PHRASES.length;
        timerId = setTimeout(tick, 2500);
        return;
      }

      charIdx += direction;
      setPlaceholderText(s.slice(0, charIdx));

      let delay = 60;
      if (direction > 0 && charIdx >= s.length) {
        direction = -1;
        delay = 1600;
      } else if (direction < 0 && charIdx <= 0) {
        direction = 1;
        phraseIdx = (phraseIdx + 1) % PHRASES.length;
        delay = 350;
      } else if (direction < 0) {
        delay = 30;
      }
      timerId = setTimeout(tick, delay);
    };

    tick();
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [reduceMotion]);

  const handleSubmit = () => {
    const trimmed = inputVal.trim();
    setInputVal('');
    if (trimmed) {
      openBotWithPrompt(trimmed);
    } else {
      navTo('chat');
    }
  };

  return (
    <div className="gen">
      <div className="gh">✦ Generate your MechTrack</div>
      <div className="gbar">
        <input
          className="gin"
          type="text"
          placeholder={focused ? 'e.g. I want to learn robotics' : ' '}
          autoComplete="off"
          aria-label="Tell Mech Bot what you want to learn or build"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
          }}
        />
        <span className="gph" aria-hidden="true">
          {placeholderText}
        </span>
        <button
          className="gbtn"
          aria-label="Generate MechTrack"
          onClick={handleSubmit}
        >
          ➤
        </button>
      </div>
      <p className="gsub">
        Tell Mech Bot what you want to learn or build. It creates your path step by step.
      </p>
    </div>
  );
}
