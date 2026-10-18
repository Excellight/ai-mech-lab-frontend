import React, { useState } from 'react';
import { useMechLab } from '../context/MechLabContext';
import ConceptExplorer from '../components/shared/ConceptExplorer';

const LAB_BENCHES = [
  { id: 'robotics-pid', label: '🎛️ PID Controller' },
  { id: 'mechatronics-m1-t1.1', label: '⚡ Ohm’s Law' },
  { id: 'mechatronics-m1-t1.2', label: '🔌 Series / Parallel' },
  { id: 'mechatronics-m1-t1.3', label: '💡 LED & Multimeter' },
  { id: 'mechatronics-m2-t2.1', label: '📡 ADC & Ultrasonic' },
  { id: 'mechatronics-m3-t3.1', label: '⚙️ PWM & Actuators' },
  { id: 'ai-m2-t2.1', label: '🔢 NumPy Vectors' },
  { id: 'ai-m3-t3.1', label: '📐 Dot Product' },
  { id: 'ai-m4-t4.2', label: '📈 ML Fitter' }
];

export default function AiLabScreen({ active }) {
  const {
    navTo,
    setExperimentMeta,
    activeLabBench,
    setActiveLabBench,
    openBotWithPrompt
  } = useMechLab();
  const [sensorVal, setSensorVal] = useState(50);

  const statusText =
    sensorVal < 35
      ? 'Turn left'
      : sensorVal > 65
      ? 'Turn right'
      : 'Go straight';

  const handleOpenExperiment = (e, title, subtitle) => {
    e.preventDefault();
    setExperimentMeta({ title, subtitle });
    navTo('experiment');
  };

  return (
    <section className={`screen${active ? ' show' : ''}`} id="lab">
      <div className="hdr">
        <h1>Practice</h1>
      </div>
      <div className="chips">
        <button
          className="chip"
          type="button"
          aria-pressed="true"
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
          aria-pressed="false"
          onClick={() => navTo('games')}
        >
          Games
        </button>
      </div>
      <div className="card" style={{ marginBottom: '12px' }}>
        <h2>Try it: line sensor</h2>
        <p className="meta">Move the slider like a sensor reading.</p>
        <input
          type="range"
          id="sl"
          min="0"
          max="100"
          value={sensorVal}
          aria-label="Sensor reading"
          onChange={(e) => setSensorVal(Number(e.target.value))}
        />
        <div className="out" id="out" role="status">
          {statusText}
        </div>
      </div>
      <div className="g2" style={{ marginBottom: '14px' }}>
        <a
          className="tile"
          href="#chat"
          onClick={(e) => {
            e.preventDefault();
            navTo('chat');
          }}
        >
          <i>🤖</i>
          <b>Ask Mech Bot</b>
          <br />
          Get help while you build
        </a>
        <a
          className="tile"
          href="#projects"
          onClick={(e) => {
            e.preventDefault();
            navTo('projects');
          }}
        >
          <i>🛠️</i>
          <b>Projects</b>
          <br />
          Build real machines
        </a>
        <a
          className="tile"
          href="#experiment"
          onClick={(e) =>
            handleOpenExperiment(
              e,
              'Hand-sign model',
              'Train a small classifier'
            )
          }
        >
          <i>🧠</i>
          <b>Hand-sign model</b>
          <br />
          Train a small classifier
        </a>
        <a
          className="tile"
          href="#experiment"
          onClick={(e) =>
            handleOpenExperiment(
              e,
              'Object detector',
              'Run vision on a camera'
            )
          }
        >
          <i>👁️</i>
          <b>Object detector</b>
          <br />
          Run vision on a camera
        </a>
      </div>

      {/* Phase 2: Interactive Concept Explorers Workbench */}
      <div className="card" style={{ marginBottom: '12px' }}>
        <span className="tag" style={{ marginTop: 0 }}>
          🧪 Interactive Simulation Benches
        </span>
        <h2 style={{ fontSize: '1.05rem', marginTop: '4px' }}>
          Explore AI, Circuits, Sensors &amp; Control Systems
        </h2>
        <p className="meta" style={{ marginBottom: '8px' }}>
          Select a simulation bench below to test equations and hardware parameters live:
        </p>
        <div className="chips" style={{ marginBottom: 0 }}>
          {LAB_BENCHES.map((bench) => (
            <button
              key={bench.id}
              type="button"
              className="chip"
              aria-pressed={activeLabBench === bench.id ? 'true' : 'false'}
              onClick={() => setActiveLabBench(bench.id)}
            >
              {bench.label}
            </button>
          ))}
        </div>
      </div>

      <ConceptExplorer
        topicId={activeLabBench}
        stopTitle="Interactive AI & Mechatronics Workbench"
        onAskBot={(msg) => openBotWithPrompt(msg)}
      />
    </section>
  );
}
