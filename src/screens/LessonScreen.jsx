import React, { useState, useEffect, useMemo } from 'react';
import { useMechLab } from '../context/MechLabContext';
import ConceptExplorer from '../components/shared/ConceptExplorer';
import {
  TOPIC_CHECKPOINTS,
  COURSE_TO_PROJECT_MAP
} from '../data/interactiveClassroomData';

function renderSpans(spans, fallbackText) {
  if (!spans || spans.length === 0) {
    return fallbackText;
  }
  return spans.map((sp, idx) => {
    if (sp.code) {
      return (
        <code key={idx} className="lesson-inline-code">
          {sp.text}
        </code>
      );
    }
    if (sp.bold && sp.italic) {
      return (
        <b key={idx}>
          <i>{sp.text}</i>
        </b>
      );
    }
    if (sp.bold) {
      return <b key={idx}>{sp.text}</b>;
    }
    if (sp.italic) {
      return <i key={idx}>{sp.text}</i>;
    }
    return <React.Fragment key={idx}>{sp.text}</React.Fragment>;
  });
}

function renderBlock(block, index, topicTitle) {
  if (block.type === 'heading') {
    if (block.level === 1) {
      return (
        <h2 key={index} className="lesson-h1">
          {block.text}
        </h2>
      );
    }
    if (block.level === 2) {
      return (
        <h2 key={index} className="lesson-h2">
          {block.text}
        </h2>
      );
    }
    return (
      <h3 key={index} className="lesson-h3">
        {block.text}
      </h3>
    );
  }

  if (block.type === 'paragraph') {
    return (
      <p key={index} className="lesson-p">
        {renderSpans(block.spans, block.text)}
      </p>
    );
  }

  if (block.type === 'code') {
    return (
      <pre key={index} className="lesson-code">
        <code>{block.text}</code>
      </pre>
    );
  }

  if (block.type === 'list') {
    const ListTag = block.ordered ? 'ol' : 'ul';
    return (
      <ListTag key={index} className="lesson-list">
        {block.items.map((item, i) => (
          <li key={i}>
            {typeof item === 'string'
              ? item
              : renderSpans(item.spans, item.text)}
          </li>
        ))}
      </ListTag>
    );
  }

  if (block.type === 'table') {
    return (
      <div key={index} className="lesson-table-wrap">
        <table className="lesson-table">
          {block.headers && block.headers.length > 0 && (
            <thead>
              <tr>
                {block.headers.map((hdr, hIdx) => (
                  <th key={hIdx}>{hdr}</th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {block.rows.map((row, rIdx) => (
              <tr key={rIdx}>
                {row.map((cell, cIdx) => (
                  <td key={cIdx}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (block.type === 'figure') {
    return (
      <figure key={index} className="lesson-figure">
        <img
          src={block.src}
          alt={block.caption || topicTitle}
          loading="lazy"
        />
        {block.caption && <figcaption>{block.caption}</figcaption>}
      </figure>
    );
  }

  return null;
}

export default function LessonScreen({ active }) {
  const {
    navTo,
    showToast,
    getCurrentLessonData,
    openLesson,
    completeAndAdvanceLesson,
    openBotWithPrompt,
    requestSocraticCoaching,
    openQuizDeck,
    openLabBench,
    selectTrackByTitleOrKey,
    awardXp
  } = useMechLab();

  const {
    courseKey,
    track,
    stepIndex,
    stopTitle,
    totalStops,
    topicData,
    topicId
  } = getCurrentLessonData();

  const [videoPlaying, setVideoPlaying] = useState(false);
  const [readingMode, setReadingMode] = useState('full'); // 'full' | 'step'
  const [unlockedSection, setUnlockedSection] = useState(0);
  const [activeCheckIdx, setActiveCheckIdx] = useState(0);
  const [selectedOptByCheck, setSelectedOptByCheck] = useState({});
  const [showHintByCheck, setShowHintByCheck] = useState({});
  const [solvedChecks, setSolvedChecks] = useState({});

  useEffect(() => {
    setVideoPlaying(false);
    setUnlockedSection(0);
    setActiveCheckIdx(0);
    setSelectedOptByCheck({});
    setShowHintByCheck({});
  }, [courseKey, stepIndex, topicData?.topicId]);

  const progressPct = Math.round(
    ((stepIndex + 1) / Math.max(1, totalStops)) * 100
  );

  // Group verbatim PDF blocks into bite-sized sections for Step-by-Step mode
  // while keeping 100% of blocks and figures mounted in the DOM
  const lessonSections = useMemo(() => {
    if (!topicData || !Array.isArray(topicData.blocks)) return [];
    const sections = [];
    let current = [];
    topicData.blocks.forEach((b, idx) => {
      if (b.type === 'heading' && current.length >= 3) {
        sections.push(current);
        current = [{ block: b, idx }];
      } else {
        current.push({ block: b, idx });
      }
    });
    if (current.length > 0) sections.push(current);
    return sections;
  }, [topicData]);

  // Phase 1: Rich multi-question checkpoints per lesson
  const checkpoints = useMemo(() => {
    const list = TOPIC_CHECKPOINTS[topicId] || TOPIC_CHECKPOINTS['robotics-pid'];
    return list && list.length > 0 ? list : TOPIC_CHECKPOINTS['robotics-pid'];
  }, [topicId]);

  const currentCheck = checkpoints[activeCheckIdx] || checkpoints[0];
  const selectedOpt = selectedOptByCheck[activeCheckIdx] ?? null;
  const hintVisible = !!showHintByCheck[activeCheckIdx];

  const handlePickOption = (idx, isOk) => {
    setSelectedOptByCheck((prev) => ({ ...prev, [activeCheckIdx]: idx }));
    const checkKey = `${topicId}-${activeCheckIdx}`;
    if (isOk) {
      if (!solvedChecks[checkKey]) {
        setSolvedChecks((prev) => ({ ...prev, [checkKey]: true }));
        awardXp(
          15,
          `Solved checkpoint in ${topicData ? topicData.title : stopTitle}`,
          'Courses',
          true
        );
        showToast('Correct! +15 XP');
      } else {
        showToast('Correct! +10 XP');
      }
    } else {
      showToast('Not quite — check the diagnostic explanation below');
    }
  };

  const recommendedDeckId = useMemo(() => {
    if (courseKey === 'ai') return 'ai';
    if (topicId.startsWith('mechatronics-m1')) return 'circuits';
    if (topicId.startsWith('mechatronics-m2')) return 'sensors';
    return 'pid';
  }, [courseKey, topicId]);

  const projectBridge =
    COURSE_TO_PROJECT_MAP[courseKey] || COURSE_TO_PROJECT_MAP.mechatronics;

  const backTarget = track?.k === 'project' ? 'project' : 'course';

  return (
    <section className={`screen${active ? ' show' : ''}`} id="lesson">
      <div className="hdr">
        <a
          className="back"
          href={`#${backTarget}`}
          aria-label="Back"
          onClick={(e) => {
            e.preventDefault();
            navTo(backTarget);
          }}
        >
          ←
        </a>
        <h1>
          Lesson {stepIndex + 1} of {totalStops}
        </h1>
      </div>

      <div className="bar" style={{ marginBottom: '14px' }}>
        <i style={{ width: `${progressPct}%` }} />
      </div>

      {/* Interactive 22-PDF Course & Lesson Switcher Bar */}
      <div className="card" style={{ marginBottom: '14px', padding: '12px 14px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '8px'
          }}
        >
          <div>
            <span className="tag" style={{ marginTop: 0 }}>
              {topicData ? topicData.courseSubtitle : track?.t || 'Course'}
            </span>
            <small className="meta">
              {topicData
                ? `${topicData.moduleLabel} · ${topicData.pageCount} PDF pages · ${topicData.imageCount} diagrams`
                : `${stopTitle}`}
            </small>
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {topicData?.pdfUrl && (
              <a
                href={topicData.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="go"
                style={{ textDecoration: 'none', fontSize: '.78rem' }}
              >
                📄 Original PDF
              </a>
            )}
            <button
              type="button"
              className="go"
              style={{ fontSize: '.78rem' }}
              onClick={() =>
                openBotWithPrompt(
                  `Explain ${topicData ? topicData.title : stopTitle}`
                )
              }
            >
              🤖 Ask Mech Bot
            </button>
          </div>
        </div>

        {/* Switch between Mechatronics (11 PDFs), AI (11 PDFs), and current track */}
        <div className="chips" style={{ marginBottom: '6px' }}>
          <button
            type="button"
            className="chip"
            aria-pressed={courseKey === 'mechatronics' ? 'true' : 'false'}
            onClick={() => openLesson('mechatronics', 0)}
          >
            Mechatronics (11 PDFs)
          </button>
          <button
            type="button"
            className="chip"
            aria-pressed={courseKey === 'ai' ? 'true' : 'false'}
            onClick={() => openLesson('ai', 0)}
          >
            AI Basics (11 PDFs)
          </button>
          {courseKey !== 'mechatronics' && courseKey !== 'ai' && (
            <button
              type="button"
              className="chip"
              aria-pressed="true"
              onClick={() => openLesson(courseKey, stepIndex)}
            >
              {track?.t}
            </button>
          )}
        </div>

        {/* Step / Topic Switcher Chips within active track */}
        <div className="chips" style={{ marginBottom: topicData ? '6px' : 0 }}>
          {(track?.s || []).map((stTitle, idx) => (
            <button
              key={idx}
              type="button"
              className="chip"
              aria-pressed={idx === stepIndex ? 'true' : 'false'}
              onClick={() => openLesson(courseKey, idx)}
            >
              {idx < (track?.a || 0) ? '✓ ' : ''}
              {stTitle}
            </button>
          ))}
        </div>

        {/* Phase 1: Full Lesson vs. Interactive Step-by-Step Mode Toggle */}
        {topicData && lessonSections.length > 1 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px',
              paddingTop: '6px',
              borderTop: '1px solid var(--line)'
            }}
          >
            <small className="meta">
              Reading mode ({lessonSections.length} concept blocks):
            </small>
            <div className="chips" style={{ margin: 0 }}>
              <button
                type="button"
                className="chip"
                aria-pressed={readingMode === 'full' ? 'true' : 'false'}
                onClick={() => setReadingMode('full')}
              >
                📖 Full Lesson
              </button>
              <button
                type="button"
                className="chip"
                aria-pressed={readingMode === 'step' ? 'true' : 'false'}
                onClick={() => {
                  setReadingMode('step');
                  setUnlockedSection(0);
                }}
              >
                ⚡ Step-by-Step ({Math.min(unlockedSection + 1, lessonSections.length)}/{lessonSections.length})
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Verbatim PDF Course Content OR Original PID Lesson View */}
      {topicData ? (
        <div className="card lesson-reader" style={{ marginBottom: '14px' }}>
          <p className="lab" style={{ marginTop: 0 }}>
            {topicData.moduleTitle} · {topicData.moduleLabel}
          </p>
          <h2 style={{ marginBottom: '12px', fontSize: '1.25rem' }}>
            {topicData.topicCode} — {topicData.title}
          </h2>

          <div className="lesson-body">
            {lessonSections.map((secItems, secIdx) => {
              const isVisible =
                readingMode === 'full' || secIdx <= unlockedSection;
              return (
                <div
                  key={secIdx}
                  className={`tp${isVisible ? ' show' : ''}`}
                  data-section={secIdx + 1}
                >
                  {secItems.map(({ block, idx }) =>
                    renderBlock(block, idx, topicData.title)
                  )}
                </div>
              );
            })}
          </div>

          {readingMode === 'step' &&
            unlockedSection + 1 < lessonSections.length && (
              <div style={{ marginTop: '12px' }}>
                <button
                  type="button"
                  className="btn g"
                  onClick={() =>
                    setUnlockedSection((prev) =>
                      Math.min(lessonSections.length - 1, prev + 1)
                    )
                  }
                >
                  Continue to Section {unlockedSection + 2} of{' '}
                  {lessonSections.length} →
                </button>
              </div>
            )}
        </div>
      ) : (
        <>
          <h2 style={{ marginBottom: '10px' }}>{stopTitle}</h2>
          <button
            className="vid"
            id="vd"
            type="button"
            aria-label="Play video"
            style={{ border: 0, width: '100%' }}
            onClick={() => {
              const next = !videoPlaying;
              setVideoPlaying(next);
              showToast(next ? 'Playing lesson video' : 'Paused');
            }}
          >
            {videoPlaying ? '⏸ Playing...' : '▶'}
          </button>
          <p>
            A PID controller compares where your robot is with where it should
            be, then corrects the motors. It does this many times per second.
          </p>
          <div className="kp">
            <b>Key points</b>
            <br />
            P reacts to the error now.
            <br />
            I fixes error that builds up.
            <br />
            D slows the correction to avoid overshoot.
          </div>
        </>
      )}

      {/* Phase 2: Interactive Concept Explorer Card */}
      <ConceptExplorer
        topicId={topicId}
        stopTitle={topicData ? topicData.title : stopTitle}
        onOpenLab={(tId) => openLabBench(tId)}
        onAskBot={(msg) => openBotWithPrompt(msg)}
      />

      {/* Phase 1 & 3: Interactive Checkpoints with Hints, Diagnostic Feedback, and Socratic Coaching */}
      <div className="card" style={{ marginBottom: '14px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '8px'
          }}
        >
          <div className="chips" style={{ margin: 0 }}>
            {checkpoints.map((_, cIdx) => {
              const isSolved = !!solvedChecks[`${topicId}-${cIdx}`];
              return (
                <button
                  key={cIdx}
                  type="button"
                  className="chip"
                  aria-pressed={activeCheckIdx === cIdx ? 'true' : 'false'}
                  onClick={() => setActiveCheckIdx(cIdx)}
                >
                  {isSolved ? '✓ ' : ''}Check {cIdx + 1}
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="go"
              style={{ fontSize: '.78rem' }}
              onClick={() =>
                setShowHintByCheck((prev) => ({
                  ...prev,
                  [activeCheckIdx]: !prev[activeCheckIdx]
                }))
              }
            >
              {hintVisible ? '🙈 Hide Hint' : '💡 Hint'}
            </button>
            <button
              type="button"
              className="go"
              style={{ fontSize: '.78rem' }}
              onClick={() => requestSocraticCoaching(topicId)}
            >
              🤖 Socratic Coach
            </button>
          </div>
        </div>

        <p className="lab" style={{ marginTop: '4px' }}>
          {currentCheck.q}
        </p>

        {hintVisible && currentCheck.hint && (
          <div className="kp" style={{ marginBottom: '10px' }}>
            <b>💡 Socratic Hint:</b> {currentCheck.hint}
          </div>
        )}

        {currentCheck.o.map((optLabel, idx) => {
          const isOk = idx === currentCheck.a;
          let cls = 'opt';
          if (selectedOpt === idx) {
            cls += isOk ? ' ok' : ' no';
          }
          return (
            <button
              key={idx}
              type="button"
              className={cls}
              data-ok={isOk ? '1' : undefined}
              onClick={() => handlePickOption(idx, isOk)}
            >
              {optLabel}
            </button>
          );
        })}

        {selectedOpt !== null && currentCheck.explain && (
          <div className="kp" style={{ marginTop: '10px', marginBottom: 0 }}>
            <b>
              {selectedOpt === currentCheck.a
                ? '✅ Why this is correct:'
                : '🔎 Concept Breakdown:'}
            </b>
            <br />
            {currentCheck.explain}
          </div>
        )}
      </div>

      {/* Phase 4: Learning-to-Building Bridge & Topic Practice Deck */}
      <div className="card" style={{ marginBottom: '14px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px'
          }}
        >
          <div>
            <span className="tag" style={{ marginTop: 0 }}>
              🛠️ Learning-to-Building Bridge
            </span>
            <h2 style={{ fontSize: '1rem', marginTop: '4px' }}>
              Apply in: {projectBridge.projectTitle}
            </h2>
            <p className="meta">{projectBridge.reason}</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="go"
              onClick={() => openQuizDeck(recommendedDeckId)}
            >
              📝 Practice Quiz
            </button>
            <button
              type="button"
              className="go"
              onClick={() => {
                selectTrackByTitleOrKey('project', projectBridge.projectKey);
                navTo('project');
              }}
            >
              🛠️ Open Project Track
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
        {stepIndex > 0 ? (
          <a
            className="btn g"
            href="#lesson"
            onClick={(e) => {
              e.preventDefault();
              openLesson(courseKey, stepIndex - 1);
            }}
          >
            ← Prev lesson
          </a>
        ) : (
          <a
            className="btn g"
            href={`#${backTarget}`}
            onClick={(e) => {
              e.preventDefault();
              navTo(backTarget);
            }}
          >
            Back to course
          </a>
        )}
        <a
          className="btn"
          href={`#${backTarget}`}
          onClick={(e) => {
            e.preventDefault();
            completeAndAdvanceLesson();
          }}
        >
          {stepIndex + 1 < totalStops ? 'Next lesson' : 'Finish course'}
        </a>
      </div>
    </section>
  );
}
