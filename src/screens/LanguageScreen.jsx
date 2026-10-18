import React from 'react';
import { useMechLab } from '../context/MechLabContext';

const LANGUAGES = [
  'English',
  'Français',
  'Español',
  'Português',
  'العربية',
  'हिन्दी',
  'Kiswahili',
  '日本語',
  '中文',
];

export default function LanguageScreen({ active }) {
  const { navTo, selectedLanguage, setSelectedLanguage, showToast } =
    useMechLab();

  return (
    <section className={`screen${active ? ' show' : ''}`} id="language">
      <div className="hdr">
        <a
          className="back"
          href="#settings"
          aria-label="Back"
          onClick={(e) => {
            e.preventDefault();
            navTo('settings');
          }}
        >
          ←
        </a>
        <h1>Language</h1>
      </div>
      <div className="card">
        {LANGUAGES.map((lang) => (
          <button
            key={lang}
            type="button"
            className="set hb"
            data-lang
            style={{ width: '100%', padding: '13px 0' }}
            onClick={() => {
              setSelectedLanguage(lang);
              showToast('Language updated');
            }}
          >
            {lang} <span>{selectedLanguage === lang ? '✓' : ''}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
