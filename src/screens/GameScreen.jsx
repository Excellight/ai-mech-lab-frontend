import React, { useState, useEffect, useRef } from 'react';
import { useMechLab } from '../context/MechLabContext';

export default function GameScreen({ active }) {
  const { navTo, gameMeta } = useMechLab();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [running, setRunning] = useState(false);
  const [showTarget, setShowTarget] = useState(true);
  const [targetPos, setTargetPos] = useState({ left: '40%', top: '35%' });
  const [msg, setMsg] = useState('Tap the targets as fast as you can.');
  const [btnText, setBtnText] = useState('Start');
  const arenaRef = useRef(null);
  const timerRef = useRef(null);

  const moveTarget = () => {
    if (arenaRef.current) {
      const w = Math.max(60, arenaRef.current.clientWidth - 56);
      const h = Math.max(60, arenaRef.current.clientHeight - 56);
      setTargetPos({
        left: `${Math.random() * w}px`,
        top: `${Math.random() * h}px`,
      });
    } else {
      setTargetPos({
        left: `${10 + Math.random() * 75}%`,
        top: `${10 + Math.random() * 65}%`,
      });
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleStart = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setScore(0);
    setTimeLeft(15);
    setRunning(true);
    setShowTarget(true);
    setMsg('Go!');
    setBtnText('Restart');
    moveTarget();

    let gl = 15;
    timerRef.current = setInterval(() => {
      gl -= 1;
      setTimeLeft(gl);
      if (gl <= 0) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        setRunning(false);
        setShowTarget(false);
        setScore((finalScore) => {
          setMsg(`Time! You scored ${finalScore}`);
          return finalScore;
        });
      }
    }, 1000);
  };

  const handleTapTarget = () => {
    if (!running || timeLeft <= 0) return;
    setScore((s) => s + 1);
    moveTarget();
  };

  return (
    <section className={`screen${active ? ' show' : ''}`} id="game">
      <div className="hdr">
        <a
          className="back"
          href="#games"
          aria-label="Back"
          onClick={(e) => {
            e.preventDefault();
            navTo('games');
          }}
        >
          ←
        </a>
        <h1 id="gmT">{gameMeta.title}</h1>
      </div>
      <p className="sub" id="gmS">
        {gameMeta.subtitle}
      </p>
      <div
        className="card"
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <span>
          Score <b id="gsc">{score}</b>
        </span>
        <span>
          Time <b id="gtm">{timeLeft}</b>s
        </span>
      </div>
      <div className="arena" id="arena" ref={arenaRef}>
        <button
          id="gtg"
          type="button"
          aria-label="Target"
          style={{
            display: showTarget ? 'block' : 'none',
            left: targetPos.left,
            top: targetPos.top,
          }}
          onClick={handleTapTarget}
        >
          ⚡
        </button>
      </div>
      <p className="out" id="gmsg" role="status">
        {msg}
      </p>
      <button className="btn" id="gst" type="button" onClick={handleStart}>
        {btnText}
      </button>
    </section>
  );
}
