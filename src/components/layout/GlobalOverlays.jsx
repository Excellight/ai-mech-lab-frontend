import React, { useState } from 'react';
import { useMechLab } from '../../context/MechLabContext';
import { SCREEN_ROUTES, SCREEN_NAMES } from '../../data/initialData';
import { ASSETS } from '../../data/brandAssets';

export default function GlobalOverlays() {
  const {
    currentScreen,
    chatTab,
    navTo,
    screenMenuOpen,
    setScreenMenuOpen,
    toastMsg,
    sendMechBotMessage
  } = useMechLab();

  const [chatInput, setChatInput] = useState('');

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    sendMechBotMessage(chatInput);
    setChatInput('');
  };

  return (
    <>
      <div className={`toast${toastMsg ? ' show' : ''}`} id="toast" role="status">
        {toastMsg}
      </div>

      <button
        className="fab"
        id="fab"
        aria-label="Open Mech Bot assistant"
        aria-expanded="false"
        onClick={() => navTo('chat')}
      >
        <img src={ASSETS.BOT_MASCOT} alt="" />
      </button>

      <button
        className="pill"
        id="pill"
        aria-label="All screens"
        onClick={() => setScreenMenuOpen(true)}
      >
        ▦
      </button>

      <div
        id="menu"
        className={screenMenuOpen ? 'show' : ''}
        onClick={(e) => {
          if (e.target.id === 'menu') setScreenMenuOpen(false);
        }}
      >
        <div>
          <p className="lab" style={{ margin: '6px' }}>
            All {SCREEN_NAMES.length} screens
          </p>
          {SCREEN_NAMES.map((name, i) => (
            <button
              key={SCREEN_ROUTES[i]}
              onClick={() => {
                setScreenMenuOpen(false);
                navTo(SCREEN_ROUTES[i]);
              }}
            >
              <b>{i + 1}</b>
              {name}
            </button>
          ))}
        </div>
      </div>

      <div
        className="inp"
        style={
          currentScreen === 'chat' && chatTab === 'chat'
            ? { display: 'flex' }
            : undefined
        }
      >
        <input
          className="f"
          id="ci"
          placeholder="Ask Mech Bot..."
          aria-label="Message"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendChat();
          }}
        />
        <button className="btn" id="sb" onClick={handleSendChat}>
          Send
        </button>
      </div>
    </>
  );
}
