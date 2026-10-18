import React from 'react';
import { useMechLab } from '../../context/MechLabContext';
import { ASSETS } from '../../data/brandAssets';
import {
  PROJECT_LESSON_BRIDGES,
  COURSE_TO_PROJECT_MAP
} from '../../data/interactiveClassroomData';

export default function MechTrackMap({ kind = 'course' }) {
  const {
    tracks,
    activeTrackKeys,
    navTo,
    openLesson,
    completeProjectStation,
    selectTrackByTitleOrKey,
    showToast
  } = useMechLab();

  const defaultKey = kind === 'course' ? 'drone' : 'obstacle';
  const key =
    activeTrackKeys[kind] && tracks[activeTrackKeys[kind]]?.k === kind
      ? activeTrackKeys[kind]
      : defaultKey;
  const d = tracks[key] || tracks[defaultKey];

  const n = d.s.length;
  const a = d.a;
  const X = [85, 275];
  const Y = (i) => 250 + i * 130;
  const ly = Y(n - 1);
  const H = ly + 400;
  const u = 'm' + kind;

  let p = 'M180 130C180 190 85 190 85 250';
  for (let i = 1; i < n; i++) {
    p += `C${X[(i - 1) % 2]} ${Y(i - 1) + 60} ${X[i % 2]} ${Y(i) - 60} ${
      X[i % 2]
    } ${Y(i)}`;
  }
  p += `C${X[(n - 1) % 2]} ${ly + 60} 180 ${ly + 80} 180 ${ly + 160}V${
    ly + 250
  }`;

  const L = 160 + (n - 1) * 245 + 290;
  const prog = Math.round(((160 + a * 245) / L) * 100);

  const sideTraces = [];
  for (let y = 190, j = 0; y < H - 150; y += 260, j++) {
    if (j % 2) {
      sideTraces.push(
        <React.Fragment key={y}>
          <path d={`M360 ${y}H336L322 ${y - 14}H306`} />
          <circle cx="301" cy={y - 14} r="4" />
        </React.Fragment>
      );
    } else {
      sideTraces.push(
        <React.Fragment key={y}>
          <path d={`M0 ${y}H24L38 ${y + 14}H52`} />
          <circle cx="57" cy={y + 14} r="4" />
        </React.Fragment>
      );
    }
  }

  const m = d.m || ['Lesson 1', 0];
  const btnLabel =
    a >= n
      ? 'Review lessons'
      : a === 0
      ? `Start: ${d.s[0]}`
      : `Continue: ${m[0]}`;
  const subText = `${d.t} · ${Math.min(a, n)} of ${n} ${
    kind === 'course' ? 'modules' : 'steps'
  } done`;

  const handleStationClick = (idx, status) => {
    if (status === 'lock') {
      showToast('Locked: finish the previous step first');
    } else {
      openLesson(key, idx);
    }
  };

  // Phase 4: Learning-to-Building Bridge metadata
  const activeStationIdx = Math.min(a, n - 1);
  const projectBridge =
    kind === 'project' ? PROJECT_LESSON_BRIDGES[key] : null;
  const activeStationBridge =
    projectBridge?.stations?.[activeStationIdx] ||
    projectBridge?.stations?.[0] ||
    null;
  const courseBridge =
    kind === 'course'
      ? COURSE_TO_PROJECT_MAP[key] || COURSE_TO_PROJECT_MAP.mechatronics
      : null;

  return (
    <>
      <div className="hdr">
        <a
          className="back"
          href={kind === 'course' ? '#courses' : '#projects'}
          aria-label="Back"
          onClick={(e) => {
            e.preventDefault();
            navTo(kind === 'course' ? 'courses' : 'projects');
          }}
        >
          ←
        </a>
        <h1>My MechTracks</h1>
      </div>
      <p className="sub">{subText}</p>
      <div className="mt" style={{ aspectRatio: `360/${H}` }}>
        <svg viewBox={`0 0 360 ${H}`} aria-hidden="true">
          <defs>
            <path id={u} pathLength="100" d={p} />
          </defs>
          <g fill="none">
            <use
              href={`#${u}`}
              strokeLinecap="round"
              strokeWidth="60"
              stroke="#8EC5FF"
            />
            <use
              href={`#${u}`}
              strokeLinecap="round"
              strokeWidth="52"
              stroke="#0E2147"
            />
            <use
              href={`#${u}`}
              className="tr1"
              strokeWidth="52"
              stroke="#19C7EE"
              strokeDasharray="0.55 1.05"
            />
            {a < n && (
              <use
                href={`#${u}`}
                strokeWidth="52"
                stroke="#0E2147"
                opacity=".6"
                strokeDasharray={`0 ${prog} 300`}
              />
            )}
          </g>
          <g fill="none" strokeWidth="2" style={{ stroke: 'var(--line)' }}>
            {sideTraces}
          </g>
        </svg>

        {d.s.map((stopTitle, i) => {
          const st = i < a ? 'done' : i === a ? 'cur' : 'lock';
          const iconSrc =
            st === 'done'
              ? ASSETS.TRACK_CHECK
              : st === 'cur'
              ? ASSETS.TRACK_MOTOR
              : ASSETS.TRACK_LOCK;

          return (
            <div
              key={i}
              className={`ms${i % 2 ? ' r' : ''} ${st}`}
              style={{
                left: `${X[i % 2] / 3.6}%`,
                top: `${(Y(i) / H) * 100}%`
              }}
              data-go={st !== 'lock' ? '#lesson' : undefined}
              data-toast={
                st === 'lock'
                  ? 'Locked: finish the previous step first'
                  : undefined
              }
              onClick={() => handleStationClick(i, st)}
            >
              <img src={iconSrc} alt="" />
              <div className="ml">
                <b>{stopTitle}</b>
                {st === 'done' && <i className="rb">✓ COMPLETED</i>}
                {st === 'lock' && <i className="rb lk">🔒 LOCKED</i>}
                {st === 'cur' && (
                  <div className="act">
                    <small>ACTIVE MODULE:</small>
                    <strong>{m[0]}</strong>
                    <div className="bar">
                      <i style={{ width: `${m[1]}%` }} />
                    </div>
                    <small>{m[1]}% complete</small>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div className="mg" style={{ top: `${(2 / H) * 100}%` }}>
          <img src={ASSETS.TRACK_MOTOR} alt="Start gate" />
        </div>
        <div className="mtg" style={{ top: `${(21 / H) * 100}%` }}>
          START
        </div>
        <div className="mf" style={{ top: `${((ly + 66) / H) * 100}%` }}>
          <b>{d.f[0]}</b>
          <i>FINISH</i>
          <img src={ASSETS.TRACK_CHECK} alt="Finish platform" />
          <b>{d.f[1]}</b>
        </div>
      </div>

      {/* Phase 4: Learning-to-Building Pathway Card */}
      {kind === 'project' && activeStationBridge && (
        <div className="card" style={{ marginBottom: '12px' }}>
          <span className="tag" style={{ marginTop: 0 }}>
            🔗 Station {activeStationIdx + 1}: {activeStationBridge.stationTitle}
          </span>
          <h2 style={{ fontSize: '1rem', marginTop: '4px' }}>
            Linked Lesson: {activeStationBridge.lessonLabel}
          </h2>
          <p className="meta" style={{ marginBottom: '8px' }}>
            {activeStationBridge.buildTip}
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="go"
              onClick={() =>
                openLesson(
                  activeStationBridge.courseKey,
                  activeStationBridge.lessonStepIndex ?? activeStationBridge.stepIndex
                )
              }
            >
              📖 Study Linked PDF Lesson
            </button>
            {a < n && (
              <button
                type="button"
                className="go"
                onClick={() => completeProjectStation(key, activeStationIdx)}
              >
                ✅ Complete Build Station (+40 XP)
              </button>
            )}
          </div>
        </div>
      )}

      {kind === 'course' && courseBridge && (
        <div className="card" style={{ marginBottom: '12px' }}>
          <span className="tag" style={{ marginTop: 0 }}>
            🛠️ Companion Build Project
          </span>
          <h2 style={{ fontSize: '1rem', marginTop: '4px' }}>
            {courseBridge.projectTitle}
          </h2>
          <p className="meta" style={{ marginBottom: '8px' }}>
            {courseBridge.reason}
          </p>
          <button
            type="button"
            className="go"
            onClick={() => {
              selectTrackByTitleOrKey('project', courseBridge.projectKey);
              navTo('project');
            }}
          >
            🛠️ Open Project Track
          </button>
        </div>
      )}

      <a
        className="btn"
        href="#lesson"
        onClick={(e) => {
          e.preventDefault();
          openLesson(key, Math.min(a, n - 1));
        }}
      >
        {btnLabel}
      </a>
    </>
  );
}
