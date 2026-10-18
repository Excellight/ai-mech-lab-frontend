import React from 'react';
import { useMechLab } from '../context/MechLabContext';
import { ASSETS } from '../data/brandAssets';

export default function ChatScreen({ active }) {
  const {
    navTo,
    chatTab,
    setChatTab,
    chatMessages,
    sendMechBotMessage,
    resetChat,
    selectTrackByTitleOrKey,
    getCurrentLessonData
  } = useMechLab();

  const { topicData, stopTitle, topicId } = getCurrentLessonData();
  const activeLessonTitle = topicData
    ? `${topicData.topicCode}: ${topicData.title}`
    : stopTitle;

  const handleOpenCourse = (title) => {
    selectTrackByTitleOrKey('course', title);
    navTo('course');
  };

  return (
    <section className={`screen${active ? ' show' : ''}`} id="chat">
      <div className="hdr">
        <a
          className="back"
          href="#dash"
          aria-label="Back"
          onClick={(e) => {
            e.preventDefault();
            navTo('dash');
          }}
        >
          ←
        </a>
        <img
          src={ASSETS.BOT_AVATAR_HEADER}
          alt=""
          style={{ height: '40px' }}
        />
        <div style={{ flex: 1 }}>
          <b>Mech Bot</b>
          <span className="on" style={{ margin: 0 }}>
            ● Online
          </span>
        </div>
        <button
          className="chip"
          id="newc"
          type="button"
          onClick={() => {
            resetChat();
            setChatTab('chat');
          }}
        >
          + New
        </button>
      </div>

      <div className="chips">
        <button
          className="chip"
          type="button"
          data-tab="chat"
          aria-pressed={chatTab === 'chat' ? 'true' : 'false'}
          onClick={() => setChatTab('chat')}
        >
          Chat
        </button>
        <button
          className="chip"
          type="button"
          data-tab="courses"
          aria-pressed={chatTab === 'courses' ? 'true' : 'false'}
          onClick={() => setChatTab('courses')}
        >
          My courses
        </button>
        <button
          className="chip"
          type="button"
          data-tab="hist"
          aria-pressed={chatTab === 'hist' ? 'true' : 'false'}
          onClick={() => setChatTab('hist')}
        >
          History
        </button>
      </div>

      <div className={`tp${chatTab === 'chat' ? ' show' : ''}`} id="t-chat">
        {/* Phase 3: Active Classroom Context & 3-Tier Socratic Coaching Bar */}
        <div className="card" style={{ marginBottom: '10px', padding: '10px 12px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '6px',
              marginBottom: '6px'
            }}
          >
            <small className="meta">
              <b>Active Lesson Context:</b> {activeLessonTitle}
            </small>
            <button
              type="button"
              className="go"
              style={{ fontSize: '.74rem' }}
              onClick={() => navTo('lesson')}
            >
              📖 Return to Lesson
            </button>
          </div>
          <div className="chips" style={{ margin: 0 }}>
            <button
              type="button"
              className="chip"
              onClick={() =>
                sendMechBotMessage(
                  `Give me a Tier 1 guiding question for ${activeLessonTitle}`,
                  1
                )
              }
            >
              🤔 Tier 1: Guiding Question
            </button>
            <button
              type="button"
              className="chip"
              onClick={() =>
                sendMechBotMessage(
                  `Give me a Tier 2 concept clue for ${activeLessonTitle}`,
                  2
                )
              }
            >
              💡 Tier 2: Concept Clue
            </button>
            <button
              type="button"
              className="chip"
              onClick={() =>
                sendMechBotMessage(
                  `Give me a Tier 3 step-by-step breakdown for ${activeLessonTitle}`,
                  3
                )
              }
            >
              🔎 Tier 3: Step-by-Step
            </button>
          </div>
        </div>

        {chatMessages.length === 0 && (
          <div className="hello" id="hello">
            <img className="hm" src={ASSETS.BOT_MASCOT} alt="" />
            <h2 className="hg">
              Hey <span className="nick">Mech Learner</span>
            </h2>
            <p className="hq">Planning to start a new build?</p>
            <button
              className="sgt"
              type="button"
              onClick={() => sendMechBotMessage('Suggest a course for me')}
            >
              <span>🎓</span>
              <b>Ask Mech Bot to suggest a course</b>
              <i>›</i>
            </button>
            <button
              className="sgt"
              type="button"
              onClick={() => sendMechBotMessage('Suggest a project for me')}
            >
              <span>🛠️</span>
              <b>Ask Mech Bot to suggest a project</b>
              <i>›</i>
            </button>
            <button
              className="sgt"
              type="button"
              onClick={() =>
                sendMechBotMessage(
                  `Give me a Socratic hint on ${activeLessonTitle}`,
                  1
                )
              }
            >
              <span>🤔</span>
              <b>Socratic coach: Hint on current lesson</b>
              <i>›</i>
            </button>
            <button
              className="sgt"
              type="button"
              onClick={() =>
                sendMechBotMessage(
                  `How do I apply ${activeLessonTitle} to a project?`
                )
              }
            >
              <span>🔌</span>
              <b>Connect current lesson to a hardware project</b>
              <i>›</i>
            </button>
          </div>
        )}

        <div className="msgs" id="msgs">
          {chatMessages.map((msg) => {
            if (msg.role === 'u') {
              return (
                <div key={msg.id} className="m u">
                  {msg.text}
                </div>
              );
            }

            if (msg.typing) {
              return (
                <div key={msg.id} className="m b typ">
                  {msg.steps.map((stepText, idx) => {
                    const isDone = idx < msg.activeStep - 1;
                    const isCur = idx === msg.activeStep - 1;
                    if (idx >= msg.activeStep) return null;
                    return (
                      <div
                        key={idx}
                        className={`sl${isDone ? ' done' : ''}${
                          isCur ? ' cur' : ''
                        }`}
                      >
                        <span className="ck">{isDone ? '✓' : '✦'}</span>
                        <span>{stepText}</span>
                      </div>
                    );
                  })}
                </div>
              );
            }

            return (
              <div key={msg.id} className="m b">
                <div>{msg.answer}</div>
                {msg.list && (
                  <ol className="sl2">
                    {msg.list.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ol>
                )}
                {msg.link && (
                  <a
                    className="mlink"
                    href={msg.link[1]}
                    onClick={(e) => {
                      e.preventDefault();
                      if (typeof msg.link[2] === 'function') {
                        msg.link[2]();
                      }
                      navTo(String(msg.link[1] || '#dash').replace(/^#/, ''));
                    }}
                  >
                    {msg.link[0]}
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div
        className={`tp${chatTab === 'courses' ? ' show' : ''}`}
        id="t-courses"
      >
        <h2 style={{ marginBottom: '10px' }}>Courses in progress</h2>
        <div className="courses">
          <div className="course">
            <div className="ct">
              <img src={ASSETS.COURSE_ROBOTICS} alt="Robotic arm" />
            </div>
            <div className="cb">
              <h3>Robotics Fundamentals</h3>
              <div className="bar" style={{ marginTop: '8px' }}>
                <i style={{ width: '65%' }} />
              </div>
              <div className="cf">
                <span className="meta">6 / 10 lessons</span>
                <button
                  className="go"
                  type="button"
                  onClick={() => handleOpenCourse('Robotics Fundamentals')}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>

          <div className="course">
            <div className="ct">
              <img src={ASSETS.COURSE_AI} alt="AI brain" />
            </div>
            <div className="cb">
              <h3>Artificial Intelligence Basics</h3>
              <div className="bar" style={{ marginTop: '8px' }}>
                <i style={{ width: '40%' }} />
              </div>
              <div className="cf">
                <span className="meta">4 / 11 lessons</span>
                <button
                  className="go"
                  type="button"
                  onClick={() =>
                    handleOpenCourse('Artificial Intelligence Basics')
                  }
                >
                  Continue
                </button>
              </div>
            </div>
          </div>

          <div className="course">
            <div className="ct">
              <img src={ASSETS.COURSE_MICRO} alt="Microcontroller board" />
            </div>
            <div className="cb">
              <h3>Microcontrollers 101</h3>
              <div className="bar" style={{ marginTop: '8px' }}>
                <i style={{ width: '30%' }} />
              </div>
              <div className="cf">
                <span className="meta">3 / 10 lessons</span>
                <button
                  className="go"
                  type="button"
                  onClick={() => handleOpenCourse('Microcontrollers 101')}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
        <a
          className="btn g"
          href="#courses"
          onClick={(e) => {
            e.preventDefault();
            navTo('courses');
          }}
        >
          Browse all courses
        </a>
      </div>

      <div className={`tp${chatTab === 'hist' ? ' show' : ''}`} id="t-hist">
        <div className="card">
          <button
            className="row hb"
            type="button"
            onClick={() => {
              setChatTab('chat');
              sendMechBotMessage('How does a PID controller work?');
            }}
          >
            <div className="ti">💬</div>
            <div>
              How does a PID controller work?<small>Today</small>
            </div>
            <time>Open</time>
          </button>
          <button
            className="row hb"
            type="button"
            onClick={() => {
              setChatTab('chat');
              sendMechBotMessage('Arduino or ESP32 for my first robot?');
            }}
          >
            <div className="ti">💬</div>
            <div>
              Arduino or ESP32 for my first robot?<small>Yesterday</small>
            </div>
            <time>Open</time>
          </button>
          <button
            className="row hb"
            type="button"
            onClick={() => {
              setChatTab('chat');
              sendMechBotMessage("Explain Ohm's law with an example");
            }}
          >
            <div className="ti">💬</div>
            <div>
              Explain Ohm&apos;s law with an example<small>3 days ago</small>
            </div>
            <time>Open</time>
          </button>
          <button
            className="row hb"
            type="button"
            onClick={() => {
              setChatTab('chat');
              sendMechBotMessage('Suggest a beginner AI project');
            }}
          >
            <div className="ti">💬</div>
            <div>
              Suggest a beginner AI project<small>Last week</small>
            </div>
            <time>Open</time>
          </button>
        </div>
      </div>
    </section>
  );
}
