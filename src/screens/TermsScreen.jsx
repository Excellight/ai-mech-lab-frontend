import React from 'react';
import { useMechLab } from '../context/MechLabContext';

export default function TermsScreen({ active }) {
  const { navTo } = useMechLab();

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navTo('signup');
    }
  };

  return (
    <section className={`screen${active ? ' show' : ''}`} id="terms">
      <div className="hdr">
        <button
          className="back"
          type="button"
          data-back
          aria-label="Back"
          onClick={handleBack}
        >
          ←
        </button>
        <h1>Terms and privacy</h1>
      </div>
      <div className="card">
        <h2>Terms and Conditions</h2>
        <p>
          1. Using AI Mech Lab. Use the platform to learn and build. Do not
          misuse it or share harmful content.
        </p>
        <p>
          2. Your account. Keep your password private. You are responsible for
          activity on your account.
        </p>
        <p>
          3. Community. Be respectful. Posts that break the rules may be
          removed.
        </p>
        <h2 style={{ marginTop: '14px' }}>Privacy</h2>
        <p>
          We use your details to run your account and personalise learning. We
          do not sell your data.
        </p>
        <p className="meta">
          Placeholder text. Replace with your final legal copy.
        </p>
      </div>
    </section>
  );
}
