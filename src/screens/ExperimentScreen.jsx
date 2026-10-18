import React, { useState } from 'react';
import { useMechLab } from '../context/MechLabContext';

export default function ExperimentScreen({ active }) {
  const { navTo, experimentMeta, showToast, awardXp } = useMechLab();
  const [progress, setProgress] = useState(0);
  const [btnLabel, setBtnLabel] = useState('Start training');
  const [sampleCount, setSampleCount] = useState(20);
  const [threshold, setThreshold] = useState(75);

  const handleStartTraining = () => {
    setProgress(0);
    setBtnLabel('Training...');
    setTimeout(() => {
      setProgress(100);
    }, 30);
    setTimeout(() => {
      const acc = Math.min(98, 86 + Math.round((sampleCount - 10) * 0.4));
      setBtnLabel(`Trained · ${acc}% accuracy`);
      awardXp(30, `Completed lab: ${experimentMeta.title}`, 'Labs', true);
      showToast('Model ready! +30 XP');
    }, 2500);
  };

  const estAccuracy = Math.min(98, 86 + Math.round((sampleCount - 10) * 0.4));
  const predictionState =
    threshold > estAccuracy
      ? 'Uncertain (below confidence threshold)'
      : experimentMeta.title.toLowerCase().includes('detector')
      ? `Detected: Obstacle (${estAccuracy}% conf)`
      : `Classified: Gesture "Stop" (${estAccuracy}% conf)`;

  return (
    <section className={`screen${active ? ' show' : ''}`} id="experiment">
      <div className="hdr">
        <a
          className="back"
          href="#lab"
          aria-label="Back"
          onClick={(e) => {
            e.preventDefault();
            navTo('lab');
          }}
        >
          ←
        </a>
        <h1 id="exT">{experimentMeta.title}</h1>
      </div>
      <p className="sub" id="exS">
        {experimentMeta.subtitle}
      </p>
      <div className="cam" role="img" aria-label="Camera preview">
        📷
      </div>
      <div className="kp">
        1. Collect {sampleCount} sample photos
        <br />
        2. Train the model
        <br />
        3. Test it live
      </div>
      <div className="bar" style={{ marginBottom: '12px' }}>
        <i
          id="xp"
          style={{ width: `${progress}%`, transition: 'width 2.5s' }}
        />
      </div>
      <button
        className="btn"
        id="xb"
        type="button"
        onClick={handleStartTraining}
      >
        {btnLabel}
      </button>

      {/* Interactive Dataset & Confidence Threshold Explorer */}
      <div className="card" style={{ marginTop: '14px' }}>
        <h2>Live Model Parameters</h2>
        <p className="meta">
          Adjust training sample size and confidence threshold:
        </p>
        <p className="lab">Training samples ({sampleCount} photos)</p>
        <input
          type="range"
          min="10"
          max="40"
          step="5"
          value={sampleCount}
          aria-label="Training sample count"
          onChange={(e) => setSampleCount(Number(e.target.value))}
        />
        <p className="lab">Confidence threshold ({threshold}%)</p>
        <input
          type="range"
          min="50"
          max="95"
          step="5"
          value={threshold}
          aria-label="Confidence threshold"
          onChange={(e) => setThreshold(Number(e.target.value))}
        />
        <div className="out" role="status">
          {predictionState}
        </div>
      </div>
    </section>
  );
}
