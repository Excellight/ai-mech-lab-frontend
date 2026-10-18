import React, { useState } from 'react';
import { useMechLab } from '../context/MechLabContext';

export default function ThreadScreen({ active }) {
  const { navTo, threadMeta, sendThreadMessage } = useMechLab();
  const [inputVal, setInputVal] = useState('');

  const handleSend = () => {
    if (!inputVal.trim()) return;
    sendThreadMessage(inputVal);
    setInputVal('');
  };

  return (
    <section className={`screen${active ? ' show' : ''}`} id="thread">
      <div className="hdr">
        <a
          className="back"
          href="#messages"
          aria-label="Back"
          onClick={(e) => {
            e.preventDefault();
            navTo('messages');
          }}
        >
          ←
        </a>
        <div className="av2" id="thA">
          {threadMeta.avatar}
        </div>
        <h1 id="thN" style={{ fontSize: '1rem' }}>
          {threadMeta.name}
        </h1>
      </div>
      <div className="msgs" id="tmsgs" style={{ paddingBottom: '10px' }}>
        {threadMeta.messages.map((m, idx) => (
          <div key={idx} className={`m ${m.role}`}>
            {m.text}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          className="f"
          id="tin"
          style={{ margin: 0 }}
          placeholder="Write a message..."
          aria-label="Message"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
        />
        <button
          className="btn"
          id="tsend"
          type="button"
          style={{ width: 'auto', margin: 0, padding: '0 16px' }}
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </section>
  );
}
