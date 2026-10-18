import React, { useState, useEffect } from 'react';
import { useMechLab } from '../context/MechLabContext';
import { QUIZ_QUESTIONS } from '../data/initialData';
import { QUIZ_DECKS } from '../data/interactiveClassroomData';

export default function QuizScreen({ active }) {
  const {
    navTo,
    activeQuizDeckId,
    setActiveQuizDeckId,
    awardXp,
    openBotWithPrompt
  } = useMechLab();

  const [qi, setQi] = useState(0);
  const [qs, setQs] = useState(0);
  const [picked, setPicked] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [finished, setFinished] = useState(false);

  const deck = QUIZ_DECKS[activeQuizDeckId] || QUIZ_DECKS.daily;
  const questions =
    deck && Array.isArray(deck.questions) && deck.questions.length > 0
      ? deck.questions
      : QUIZ_QUESTIONS.map((rawQ) =>
          Array.isArray(rawQ)
            ? { q: rawQ[0], o: rawQ[1] || [], a: rawQ[2] }
            : rawQ
        );

  useEffect(() => {
    if (active) {
      setQi(0);
      setQs(0);
      setPicked(null);
      setShowHint(false);
      setFinished(false);
    }
  }, [active, activeQuizDeckId]);

  const rawQ = questions[qi] || questions[0];
  const d = Array.isArray(rawQ)
    ? { q: rawQ[0], o: rawQ[1] || [], a: rawQ[2] }
    : rawQ;
  const progressPct = (qi / questions.length) * 100;

  const handlePickOption = (idx) => {
    if (picked !== null) return;
    setPicked(idx);
    if (idx === d.a) {
      setQs((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (qi + 1 >= questions.length) {
      setFinished(true);
      const pct = Math.round((qs / questions.length) * 100);
      awardXp(
        deck?.xp || 50,
        `Scored ${pct}% in ${deck?.title || 'Daily quiz'}`,
        'Quizzes',
        true
      );
    } else {
      setQi((i) => i + 1);
      setPicked(null);
      setShowHint(false);
    }
  };

  return (
    <section className={`screen${active ? ' show' : ''}`} id="quiz">
      <div className="hdr">
        <a
          className="back"
          href="#quizzes"
          aria-label="Back"
          onClick={(e) => {
            e.preventDefault();
            navTo('quizzes');
          }}
        >
          ←
        </a>
        <h1>{deck?.title || 'Daily quiz'}</h1>
      </div>

      {/* Deck Switcher Chips */}
      <div className="chips" style={{ marginBottom: '10px' }}>
        {Object.values(QUIZ_DECKS).map((dk) => (
          <button
            key={dk.id}
            type="button"
            className="chip"
            aria-pressed={activeQuizDeckId === dk.id ? 'true' : 'false'}
            onClick={() => setActiveQuizDeckId(dk.id)}
          >
            {dk.title}
          </button>
        ))}
      </div>

      {!finished ? (
        <div id="qbox">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '6px'
            }}
          >
            <p className="meta" id="qn" style={{ margin: 0 }}>
              Question {qi + 1} of {questions.length}
            </p>
            <div style={{ display: 'flex', gap: '6px' }}>
              {d.hint && (
                <button
                  type="button"
                  className="go"
                  style={{ fontSize: '.76rem' }}
                  onClick={() => setShowHint((h) => !h)}
                >
                  {showHint ? '🙈 Hide Hint' : '💡 Hint'}
                </button>
              )}
              <button
                type="button"
                className="go"
                style={{ fontSize: '.76rem' }}
                onClick={() =>
                  openBotWithPrompt(`Give me a Socratic hint for: ${d.q}`)
                }
              >
                🤖 Ask Coach
              </button>
            </div>
          </div>

          <div className="bar" style={{ marginBottom: '12px' }}>
            <i id="qb" style={{ width: `${progressPct}%` }} />
          </div>

          <h2 id="qq" style={{ marginBottom: '6px' }}>
            {d.q}
          </h2>

          {showHint && d.hint && (
            <div className="kp" style={{ marginBottom: '10px' }}>
              <b>💡 Hint:</b> {d.hint}
            </div>
          )}

          <div id="qo" data-d={picked !== null ? '1' : undefined}>
            {d.o.map((optText, idx) => {
              let cls = 'opt';
              if (picked !== null) {
                if (idx === d.a) cls += ' ok';
                else if (idx === picked) cls += ' no';
              }
              return (
                <button
                  key={optText}
                  type="button"
                  className={cls}
                  onClick={() => handlePickOption(idx)}
                >
                  {optText}
                </button>
              );
            })}
          </div>

          {picked !== null && d.explain && (
            <div className="kp" style={{ marginTop: '10px' }}>
              <b>
                {picked === d.a
                  ? '✅ Correct! Here is why:'
                  : '🔎 Diagnostic Explanation:'}
              </b>
              <br />
              {d.explain}
            </div>
          )}

          <button
            className="btn"
            id="qnx"
            type="button"
            style={{ display: picked !== null ? 'block' : 'none', marginTop: '10px' }}
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      ) : (
        <div
          id="qres"
          style={{ display: 'block', textAlign: 'center', paddingTop: '20px' }}
        >
          <div style={{ fontSize: '3rem' }}>🏆</div>
          <h2>Quiz complete</h2>
          <p className="out" id="qsc">
            {qs} / {questions.length}
          </p>
          <p className="sub">+{deck?.xp || 50} XP earned</p>
          <a
            className="btn"
            href="#quizzes"
            onClick={(e) => {
              e.preventDefault();
              navTo('quizzes');
            }}
          >
            Back to Practice
          </a>
        </div>
      )}
    </section>
  );
}
