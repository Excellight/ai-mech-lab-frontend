import React, { useState } from 'react';
import { useMechLab } from '../context/MechLabContext';
import { ASSETS } from '../data/brandAssets';

export default function AuthScreen({ active }) {
  const {
    navTo,
    isDark,
    toggleDarkLight,
    loginWithCredentials,
    loginWithOAuth
  } = useMechLab();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    await loginWithCredentials({ identifier, password });
    navTo('dash');
  };

  const handleOAuth = async (provider) => {
    await loginWithOAuth(provider);
    navTo('dash');
  };

  return (
    <section className={`screen hero${active ? ' show' : ''}`} id="auth">
      <button
        className="ic thm th2"
        type="button"
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        onClick={toggleDarkLight}
      >
        {isDark ? '☀️' : '🌙'}
      </button>
      <div className="logo">
        <img src={ASSETS.BRAND_LOGO_HERO} alt="AI Mech Lab" />
      </div>
      <p className="sub">
        Learn robotics, AI and embedded systems. Build intelligent machines.
      </p>
      <input
        className="f"
        type="text"
        placeholder="Email, phone number or username"
        aria-label="Email, phone number or username"
        autoComplete="username"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
      />
      <input
        className="f"
        type="password"
        placeholder="Password"
        aria-label="Password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="btn" type="button" onClick={handleLogin}>
        Log in
      </button>
      <div className="or">
        <span>or continue with</span>
      </div>
      <button
        className="btn g sc"
        type="button"
        onClick={() => handleOAuth('google')}
      >
        <svg viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-8.9z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.3a12 12 0 0 0 0 10.8l4-3.1z"
          />
          <path
            fill="#EA4335"
            d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.8 3.6-4.9 6.7-4.9z"
          />
        </svg>
        Continue with Google
      </button>
      <button
        className="btn g sc"
        type="button"
        onClick={() => handleOAuth('github')}
      >
        <svg viewBox="0 0 16 16" style={{ fill: 'currentColor' }}>
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
        </svg>
        Continue with GitHub
      </button>
      <button
        className="btn g sc"
        type="button"
        onClick={() => handleOAuth('linkedin')}
      >
        <svg viewBox="0 0 24 24">
          <rect width="24" height="24" rx="4" fill="#0A66C2" />
          <path
            fill="#fff"
            d="M5 9h3v10H5zM6.5 4.6a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6zM10 9h2.9v1.4c.5-.9 1.6-1.6 3.1-1.6 3 0 3.6 2 3.6 4.6V19h-3v-4.7c0-1.2-.4-2.1-1.6-2.1-1.3 0-1.9.9-1.9 2.2V19H10z"
          />
        </svg>
        Continue with LinkedIn
      </button>
      <div className="or">
        <span>New to AI Mech Lab?</span>
      </div>
      <a
        className="btn g"
        href="#signup"
        onClick={(e) => {
          e.preventDefault();
          navTo('signup');
        }}
      >
        Sign up
      </a>
    </section>
  );
}
